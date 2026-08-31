/**
 * md-log — mirror the session to a markdown file for comfortable reading.
 *
 * Ported from the pi original (.pi/extensions/md-log.ts) to omp. Differences:
 *   - imports from @oh-my-pi/pi-coding-agent
 *   - logs omp's native `ask` tool (graded quiz questions run through it too)
 *     in addition to the pi quiz/ask_user_question tools
 *   - user prompts have <system-reminder> blocks stripped (harness-injected)
 *   - session-state reads feature-detect getBranch()/getEntries()
 *   - MD_LOG_FILE=<path> auto-links at session_start (headless/print mode has
 *     no slash commands); the path must already exist
 *
 * The linked .md file is meant to be viewed rendered (e.g. in Obsidian), so
 * assistant text with $...$ math, code blocks, and markdown all render
 * natively — no rendering work here.
 *
 * Captures only reading-relevant content: user prompts, assistant text
 * (lesson prose), and quiz / ask_user_question / ask Q&A blocks. Other tools
 * are omitted. Q&A questions are written BEFORE the user answers (on
 * tool_call), so the reader sees the question appear live; the answer is
 * appended on tool_result. The question block never contains the correct
 * answer or explanation (the user reads this file live).
 *
 * Commands:
 *   /md-log <filepath>  — Link a markdown file and backfill the session.
 *   /md-unlog           — Stop logging.
 *
 * Tool:
 *   md_log_link <path>  — Same link+backfill, agent-invocable; creates the
 *                         file if missing. Lets a teaching session bind its
 *                         own topic file without manual slash commands.
 *
 * Append-only. No send-back-to-agent functionality.
 */

import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import * as fs from "node:fs";
import * as path from "node:path";

const QA_TOOLS: Record<string, true> = {
	quiz: true,
	ask_user_question: true,
	ask: true,
};

// --- Harness payload shapes ---
// omp emits these documented shapes; fields this extension does not consume
// are never read. Where a field may legitimately vary at runtime (message
// content unions, option lists) it stays `unknown` and is checked with
// typeof/Array.isArray at the point of use.

interface SessionMessage {
	role: string;
	content?: unknown; // string | Array<{ type: string; text?: string; ... }>
}

interface SessionEntry {
	type?: string;
	message?: SessionMessage;
}

interface MdLogLinkEntry {
	type?: string;
	customType?: string;
	data?: { file?: string | null };
}

interface ToolCallPart {
	type?: unknown;
	id?: unknown;
	name?: unknown;
	arguments?: unknown;
	input?: unknown;
}

interface TextPart {
	type?: unknown;
	text?: unknown;
}

interface ToolCallEvent {
	toolName?: string;
	input?: unknown;
}

interface ToolResultEvent {
	toolName?: string;
	details?: unknown;
	isError?: boolean;
}

interface QuizUpdateEvent {
	toolName?: string;
	toolCallId?: string;
	partialResult?: { details?: { options?: unknown } };
	args?: unknown;
}

// pi quiz tool result details.
interface QuizResult {
	status?: string;
	message?: string;
	dontKnow?: boolean;
	correct?: boolean;
	answers?: Array<{ index?: number; label?: string }>;
	correctIndices?: number[];
	note?: string;
	explanation?: string;
}

// pi ask_user_question tool result details.
interface AskUserQuestionResult {
	status?: string;
	message?: string;
	answers?: Array<{ type?: string; index?: number; label?: string }>;
}

// omp ask tool result details (single question, or .results[] for several).
interface AskQuestionResult {
	question?: string;
	selectedOptions?: unknown;
	customInput?: string;
	note?: string;
	timedOut?: boolean;
}

interface AskResult {
	chatRedirect?: boolean;
	results?: AskQuestionResult[];
}

// omp ask tool input.
interface AskQuestion {
	question?: string;
	header?: string;
	options?: unknown;
	multi?: boolean;
}

// omp passes handler/command contexts that are structurally wider than what
// this extension touches; these are exactly the fields used.
interface SessionManagerLike {
	getBranch?: () => unknown;
	getEntries?: () => unknown;
}
interface UiLike {
	notify?: (message: string, level?: string) => unknown;
	setStatus?: (key: string, value: string | undefined) => unknown;
	theme?: { fg?: (role: string, text: string) => string };
}
interface CtxLike {
	ui?: UiLike;
	cwd?: string;
	isIdle?: () => boolean;
	sessionManager?: SessionManagerLike;
}

function str(value: unknown): string | undefined {
	return typeof value === "string" ? value : undefined;
}

// Message content: either a plain string or an array of typed parts; collect
// the text parts verbatim.
function contentText(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	const parts: string[] = [];
	for (const part of content) {
		const textPart = part as TextPart;
		if (textPart.type === "text" && typeof textPart.text === "string") {
			parts.push(textPart.text);
		}
	}
	return parts.join("\n");
}

// Assistant text blocks: trimmed, non-empty only.
function assistantParts(content: unknown): string[] {
	if (!Array.isArray(content)) return [];
	const parts: string[] = [];
	for (const part of content) {
		const textPart = part as TextPart;
		if (textPart.type === "text" && typeof textPart.text === "string") {
			const trimmed = textPart.text.trim();
			if (trimmed.length > 0) parts.push(trimmed);
		}
	}
	return parts;
}

// Option lists arrive as records with a label; tolerate bare labels.
function optionsOf(value: unknown): Array<{ label: string }> {
	if (!Array.isArray(value)) return [];
	const out: Array<{ label: string }> = [];
	for (const option of value) {
		if (typeof option === "string") {
			out.push({ label: option });
			continue;
		}
		const label = str((option as { label?: unknown })?.label);
		if (label) out.push({ label });
	}
	return out;
}

// omp ask selectedOptions entries: plain label strings today, tolerate
// {label} objects.
function selectedLabels(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	const out: string[] = [];
	for (const entry of value) {
		if (typeof entry === "string") {
			out.push(entry);
		} else {
			const label = str((entry as { label?: unknown })?.label);
			if (label) out.push(label);
		}
	}
	return out;
}

export default function mdLog(pi: ExtensionAPI) {
	const z = pi.zod;
	let logFile: string | null = null;

	// Serialization: events can fire close together; keep appends ordered.
	let writeLock: Promise<void> = Promise.resolve();

	// quiz shuffles options inside execute(); toolCallIds whose shuffled order
	// has already been logged (guards duplicate writes per call).
	const loggedQuizQuestion = new Set<string>();

	function withLock<T>(fn: () => T | Promise<T>): Promise<T> {
		const prev = writeLock;
		let release: () => void;
		writeLock = new Promise<void>((resolve) => {
			release = resolve;
		});
		return prev.then(fn).finally(() => release!());
	}

	function appendToFile(text: string): void {
		if (!logFile) return;
		try {
			let current = "";
			if (fs.existsSync(logFile)) {
				current = fs.readFileSync(logFile, "utf-8");
			}
			const prefix = current.trim().length > 0 ? "\n\n" : "";
			fs.writeFileSync(logFile, current + prefix + text + "\n", "utf-8");
		} catch {
			// File may have been deleted externally; ignore.
		}
	}

	function setStatus(ctx: CtxLike): void {
		try {
			if (!ctx.ui || !logFile) return;
			const fg = ctx.ui.theme?.fg;
			const label = fg
				? fg("accent", "🗒 ") + fg("dim", path.basename(logFile))
				: `🗒 ${path.basename(logFile)}`;
			ctx.ui.setStatus?.("md-log", label);
		} catch {
			// Status display is cosmetic; never let it break logging.
		}
	}

	function sessionEntries(ctx: CtxLike): SessionEntry[] {
		const sm = ctx.sessionManager;
		if (typeof sm?.getBranch === "function") {
			const branch = sm.getBranch();
			return Array.isArray(branch) ? (branch as SessionEntry[]) : [];
		}
		const entries = sm?.getEntries?.();
		return Array.isArray(entries) ? (entries as SessionEntry[]) : [];
	}

	// Harness-injected context is not user prose: collapse <system-reminder>
	// blocks and <skill> declarations to compact callouts. Runs on trimmed text.
	function stripInjected(text: string): string {
		return text
			.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, () => "> [!note] system reminder")
			.replace(/<skill\b([^>]*)>[\s\S]*?<\/skill>/g, (_match, attrs: string) => {
				const name = /name="([^"]+)"/.exec(attrs)?.[1];
				return `> [!note] SKILL loaded: ${name ?? "(unknown)"}`;
			});
	}

	function callout(type: string, title: string, bodyLines: string[]): string {
		const lines = [`> [!${type}] ${title}`];
		for (const line of bodyLines) {
			lines.push(line.length === 0 ? ">" : `> ${line}`);
		}
		return lines.join("\n");
	}

	function questionCallout(
		label: string,
		question: string,
		context: string | undefined,
		options: Array<{ label: string }>,
		multi?: boolean,
	): string {
		const body: string[] = [];
		for (const line of question.split("\n")) body.push(line);
		if (context) {
			body.push("");
			for (const line of context.split("\n")) body.push(line);
		}
		if (multi) {
			body.push("");
			body.push("(multiple answers allowed)");
		}
		if (options.length > 0) {
			body.push("");
			options.forEach((option, index) => body.push(`${index + 1}. ${option.label}`));
		}
		return callout("question", label, body);
	}

	function answerCalloutQuiz(details: unknown): string {
		const result = details as QuizResult | undefined;
		const status = result?.status;
		if (status === "cancelled") {
			return callout("warning", "Quiz — cancelled", ["(user skipped)"]);
		}
		if (status === "unavailable") {
			return callout("warning", "Quiz — unavailable", [result?.message ?? ""]);
		}
		// "I don't know" is neither correct nor incorrect — it's a distinct
		// signal, so it never renders as a red ✗.
		const dontKnow = result?.dontKnow === true;
		const correct = result?.correct === true;
		const type = dontKnow ? "question" : correct ? "success" : "failure";
		const title = dontKnow
			? "Quiz — I don't know"
			: correct
				? "Quiz — correct ✓"
				: "Quiz — incorrect ✗";
		const body: string[] = [];

		if (dontKnow) {
			body.push("Your answer: I don't know");
		} else {
			const answers = result?.answers ?? [];
			const sel =
				answers
					.map((answer) => `${answer?.index}. ${answer?.label}`)
					.join(", ") || "(none)";
			body.push(`Your answer: ${sel}`);
		}

		const correctIndices = result?.correctIndices ?? [];
		body.push(`Correct answer: ${correctIndices.map(String).join(", ")}`);

		// Optional free-text note the user typed in the always-present note
		// field. Only present when non-empty, so no guard for empty strings.
		if (result?.note) {
			body.push("");
			const noteLines = result.note.split("\n");
			body.push(`Note: ${noteLines[0]}`);
			for (let i = 1; i < noteLines.length; i++) body.push(noteLines[i]);
		}

		if (result?.explanation) {
			body.push("");
			for (const line of result.explanation.split("\n")) body.push(line);
		}
		return callout(type, title, body);
	}

	function answerCalloutAskUserQuestion(details: unknown): string {
		const result = details as AskUserQuestionResult | undefined;
		const status = result?.status;
		if (status === "cancelled") {
			return callout("warning", "Question — cancelled", ["(user skipped)"]);
		}
		if (status === "unavailable") {
			return callout("warning", "Question — unavailable", [result?.message ?? ""]);
		}
		const body = (result?.answers ?? []).map((answer) => {
			if (answer?.type === "other") return `Other: ${answer.label}`;
			if (answer?.type === "text") return String(answer.label);
			return `${answer?.index}. ${answer?.label}`;
		});
		if (body.length === 0) body.push("(no answer)");
		return callout("example", "Answer", body);
	}

	// Build the answer body for one omp-ask question result.
	function ompAskAnswerLines(result: AskQuestionResult): string[] {
		const body: string[] = [];
		if (result.customInput) {
			body.push(`Other: ${result.customInput}`);
		} else {
			const selected = selectedLabels(result.selectedOptions);
			body.push(selected.length > 0 ? selected.join(", ") : "(no answer)");
		}
		if (result.timedOut) body.push("(auto-selected after timeout)");
		if (result.note) {
			body.push("");
			const noteLines = result.note.split("\n");
			body.push(`Note: ${noteLines[0]}`);
			for (let i = 1; i < noteLines.length; i++) body.push(noteLines[i]);
		}
		return body;
	}

	function answerCalloutOmpAsk(details: unknown, isError: boolean): string {
		const result = isError ? undefined : (details as AskResult | undefined);
		if (!result) {
			// omp's ask throws on user cancellation — the result arrives as an
			// error toolResult with no structured details.
			return callout("warning", "Question — cancelled", ["(user skipped)"]);
		}
		if (result.chatRedirect === true) {
			return callout("example", "Answer", ["(chose to chat about this instead of answering)"]);
		}
		if (result.results) {
			// Multi-question ask: one answer callout per question, in order.
			return result.results
				.map((answer, index) =>
					callout("example", `Answer — ${answer.question ?? `Question ${index + 1}`}`, ompAskAnswerLines(answer)),
				)
				.join("\n\n");
		}
		// Single-question result: the flattened fields carry the answer; the
		// question text was already logged on tool_call.
		return callout("example", "Answer", ompAskAnswerLines(result));
	}

	function renderUserBlock(msg: SessionMessage): string | null {
		const trimmed = stripInjected(contentText(msg.content).trim());
		if (!trimmed) return null;
		return `> [!quote] YOU\n\n${trimmed}`;
	}

	function renderAssistantBlock(msg: SessionMessage): string | null {
		const parts = assistantParts(msg.content);
		if (parts.length === 0) return null;
		return `> [!abstract] ASSISTANT\n\n${parts.join("\n\n")}`;
	}

	// omp's ask carries several questions per call; the question callouts are
	// written live on tool_call (ask never shuffles its options).
	function ompAskQuestionBlocks(input: unknown): string[] {
		const questions = (input as { questions?: AskQuestion[] } | undefined)?.questions;
		if (!Array.isArray(questions)) return [];
		const blocks: string[] = [];
		for (const question of questions) {
			if (!question) continue;
			const header = question.header?.trim();
			blocks.push(
				questionCallout(
					"Question",
					question.question ?? "",
					header || undefined,
					optionsOf(question.options),
					question.multi === true,
				),
			);
		}
		return blocks;
	}

	// --- Event handlers ---

	pi.on("session_start", async (_event, genericCtx) => {
		const ctx = genericCtx as CtxLike;
		// Headless/print sessions have no slash commands; allow env auto-link.
		const envFile = process.env.MD_LOG_FILE;
		if (!logFile && envFile) {
			const candidate = path.resolve(ctx.cwd ?? process.cwd(), envFile);
			if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
				logFile = candidate;
			}
		}

		let lastFile: string | null = null;
		for (const entry of sessionEntries(ctx)) {
			const link = entry as MdLogLinkEntry;
			if (link.type !== "custom" || link.customType !== "md-log") continue;
			const file = link.data?.file;
			lastFile = typeof file === "string" ? file : null;
		}
		if (lastFile) {
			logFile = lastFile;
			setStatus(ctx);
		}
	});

	pi.on("message_end", async (event) => {
		if (!logFile) return;
		const msg = (event as { message?: SessionMessage }).message;
		if (!msg || typeof msg.role !== "string") return;

		if (msg.role === "user") {
			const block = renderUserBlock(msg);
			if (block) await withLock(() => appendToFile(block));
			return;
		}

		if (msg.role === "assistant") {
			const block = renderAssistantBlock(msg);
			if (block) await withLock(() => appendToFile(block));
			return;
		}
		// toolResult messages are handled by the tool_result event (QA tools).
	});

	// ask_user_question never shuffles its options, so the tool_call args are
	// already the true display order — safe to write the question live, before
	// the user answers. omp's ask has the same property.
	pi.on("tool_call", async (event) => {
		if (!logFile) return;
		const call = event as ToolCallEvent;
		if (call.toolName === "ask") {
			const blocks = ompAskQuestionBlocks(call.input);
			if (blocks.length === 0) return;
			await withLock(() => appendToFile(blocks.join("\n\n")));
			return;
		}
		if (call.toolName !== "ask_user_question") return;
		const input = call.input as { question?: string; details?: string; options?: unknown } | undefined;
		const block = questionCallout(
			"Question",
			input?.question ?? "",
			input?.details?.trim() || undefined,
			optionsOf(input?.options),
		);
		await withLock(() => appendToFile(block));
	});

	// quiz DOES shuffle its options inside execute(), so the tool_call args are
	// the pre-shuffle author order — NOT what the user is shown. quiz emits an
	// onUpdate() with the true (post-shuffle) order before it blocks on the
	// user's answer; wait for that instead so the logged order always matches
	// what's on screen.
	pi.on("tool_execution_update", async (event) => {
		if (!logFile) return;
		const update = event as QuizUpdateEvent;
		if (update.toolName !== "quiz") return;
		if (!update.toolCallId || loggedQuizQuestion.has(update.toolCallId)) return;
		const shuffled = optionsOf(update.partialResult?.details?.options);
		if (shuffled.length === 0) return;
		loggedQuizQuestion.add(update.toolCallId);
		const input = (update.args ?? {}) as { question?: string; details?: string };
		const block = questionCallout("Quiz", input.question ?? "", input.details?.trim() || undefined, shuffled);
		await withLock(() => appendToFile(block));
	});

	pi.on("tool_result", async (event) => {
		if (!logFile) return;
		const result = event as ToolResultEvent;
		const toolName = result.toolName;
		if (!toolName || !QA_TOOLS[toolName]) return;
		const block = toolName === "quiz"
			? answerCalloutQuiz(result.details)
			: toolName === "ask"
				? answerCalloutOmpAsk(result.details, result.isError === true)
				: answerCalloutAskUserQuestion(result.details);
		await withLock(() => appendToFile(block));
	});

	// --- Agent-invocable link tool ---

	// Same link+backfill as /md-log, but callable by the agent so a teaching
	// session can bind its own topic file ("learn postgres" → the topic note)
	// without the user typing slash commands.
	pi.registerTool({
		name: "md_log_link",
		label: "Link md-log",
		description:
			"Mirror this session into a markdown file (append-only: user prompts, assistant prose, Q&A blocks). Creates the file if it does not exist, links it, and backfills the session history so far.",
		parameters: z.object({
			path: z.string().describe("Target markdown file, absolute or relative to the project root"),
		}),
		approval: "write",
		async execute(_toolCallId, params, _signal, _onUpdate, executeCtx) {
			const ctx = executeCtx as CtxLike;
			const resolved = path.isAbsolute(params.path)
				? params.path
				: path.resolve(ctx.cwd ?? process.cwd(), params.path);
			if (!fs.existsSync(resolved)) {
				fs.mkdirSync(path.dirname(resolved), { recursive: true });
				const title = path.basename(resolved).replace(/\.md$/i, "");
				fs.writeFileSync(resolved, `# ${title}\n`, "utf-8");
			}
			if (!fs.statSync(resolved).isFile()) {
				return { content: [{ type: "text", text: `Not a file: ${resolved}` }] };
			}
			logFile = resolved;
			pi.appendEntry("md-log", { file: resolved });
			const written = backfill(ctx);
			setStatus(ctx);
			return {
				content: [{ type: "text", text: `Linked: ${resolved} (${written} entries backfilled)` }],
				details: { file: resolved, backfilled: written },
			};
		},
	});

	// --- Commands ---

	pi.registerCommand("md-log", {
		description: "Mirror the session to a markdown file (backfills history)",
		handler: async (args, genericCtx) => {
			const ctx = genericCtx as CtxLike;
			const filepath = args.trim();
			if (!filepath) {
				ctx.ui?.notify?.("Usage: /md-log <filepath>", "warning");
				return;
			}
			if (typeof ctx.isIdle === "function" && !ctx.isIdle()) {
				ctx.ui?.notify?.("Wait for the agent to finish before linking.", "warning");
				return;
			}

			const resolved = path.isAbsolute(filepath) ? filepath : path.resolve(ctx.cwd ?? process.cwd(), filepath);

			// The file must already exist — /md-log links into an existing note,
			// it never creates one. This avoids silently scattering new files
			// (and parent directories) around the vault from a typo'd path.
			if (!fs.existsSync(resolved)) {
				ctx.ui?.notify?.(`File does not exist: ${resolved}`, "error");
				return;
			}
			if (!fs.statSync(resolved).isFile()) {
				ctx.ui?.notify?.(`Not a file: ${resolved}`, "error");
				return;
			}

			logFile = resolved;
			pi.appendEntry("md-log", { file: resolved });

			// Backfill the active branch.
			const written = backfill(ctx);

			setStatus(ctx);
			ctx.ui?.notify?.(`Linked: ${resolved} (${written} entries backfilled)`, "success");
		},
	});

	pi.registerCommand("md-unlog", {
		description: "Stop mirroring the session to a markdown file",
		handler: async (_args, genericCtx) => {
			const ctx = genericCtx as CtxLike;
			if (!logFile) {
				ctx.ui?.notify?.("No file linked", "warning");
				return;
			}
			const name = path.basename(logFile);
			logFile = null;
			pi.appendEntry("md-log", { file: null });
			setStatus(ctx);
			ctx.ui?.notify?.(`Unlinked: ${name}`, "info");
		},
	});

	// --- Backfill ---

	function backfill(ctx: CtxLike): number {
		if (!logFile) return 0;
		const entries = sessionEntries(ctx);
		if (entries.length === 0) return 0;

		// Track tool-call args from assistant messages so we can pair with
		// results.
		const toolCallArgs = new Map<string, { name: string; args: unknown }>();

		const blocks: string[] = [];
		let count = 0;
		for (const entry of entries) {
			if (entry.type !== "message") continue;
			const msg = entry.message;
			if (!msg || typeof msg.role !== "string") continue;
			count++;

			if (msg.role === "user") {
				const block = renderUserBlock(msg);
				if (block) blocks.push(block);
				continue;
			}

			if (msg.role === "assistant") {
				// Index tool calls for later pairing.
				if (Array.isArray(msg.content)) {
					for (const part of msg.content) {
						const call = part as ToolCallPart;
						if (
							call.type === "toolCall" &&
							typeof call.id === "string" &&
							typeof call.name === "string" &&
							QA_TOOLS[call.name]
						) {
							toolCallArgs.set(call.id, { name: call.name, args: call.arguments ?? call.input });
						}
					}
				}
				const block = renderAssistantBlock(msg);
				if (block) blocks.push(block);
				continue;
			}

			if (msg.role === "toolResult") {
				const toolName = str((msg as { toolName?: unknown }).toolName);
				if (!toolName || !QA_TOOLS[toolName]) continue;
				const toolCallId = str((msg as { toolCallId?: unknown }).toolCallId);
				const paired = toolCallId ? toolCallArgs.get(toolCallId) : undefined;
				// Question block. For quiz, use the persisted result's
				// `details.options` — the TRUE post-shuffle display order the
				// user actually saw — rather than the original tool-call args,
				// which are the pre-shuffle author order and can mismatch what's
				// on screen. ask_user_question and omp's ask never shuffle, so
				// their tool-call args are already the true order.
				if (paired) {
					if (paired.name === "ask") {
						const questionBlocks = ompAskQuestionBlocks(paired.args);
						if (questionBlocks.length > 0) blocks.push(questionBlocks.join("\n\n"));
					} else {
						const args = (paired.args ?? {}) as {
							question?: string;
							details?: string;
							options?: unknown;
						};
						const shuffled =
							paired.name === "quiz"
								? optionsOf((msg.details as { options?: unknown } | undefined)?.options)
								: [];
						const options = shuffled.length > 0 ? shuffled : optionsOf(args.options);
						blocks.push(
							questionCallout(
								paired.name === "quiz" ? "Quiz" : "Question",
								args.question ?? "",
								args.details?.trim() || undefined,
								options,
							),
						);
					}
				}
				const toolResultMsg = msg as {
					details?: unknown;
					isError?: unknown;
				};
				if (toolName === "quiz") {
					blocks.push(answerCalloutQuiz(toolResultMsg.details));
				} else if (toolName === "ask") {
					blocks.push(answerCalloutOmpAsk(toolResultMsg.details, toolResultMsg.isError === true));
				} else {
					blocks.push(answerCalloutAskUserQuestion(toolResultMsg.details));
				}
				continue;
			}
		}

		if (blocks.length > 0) {
			try {
				fs.writeFileSync(logFile, blocks.join("\n\n") + "\n", "utf-8");
			} catch {
				// ignore
			}
		}
		return count;
	}
}
