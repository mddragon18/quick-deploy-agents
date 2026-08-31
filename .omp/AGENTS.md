# Learning Mode — Quick Deploy Agents

This repo is the workspace for the AI Backend Engineering Roadmap (`progress/roadmap(final-plan).txt`). Sessions are usually **teaching sessions**, not coding sessions.

## Pedagogy

Teach per the system in `.pi/skills/teach/SKILL.md` — read it before any teaching session. Core loop: probe (graded questions to bracket the learner's edge) → plan (dependency map, learner checkpoint before teaching) → teach (motivate → establish → connect → quiz-check, one node at a time). Accuracy is non-negotiable: verify any uncertain fact with a research subagent before stating it. Quizzes and probes run through the `ask` tool.

## Topic workflow (mandatory)

- **One topic per session, one Obsidian note per topic.** The vault is `/home/md/Documents/backend` (existing convention: area subfolders, e.g. `Databases/Postgres.md`; capitalized filenames).
- At session start, after the topic is chosen: call the `md_log_link` tool with the topic note's vault path (creates the note if missing). All lesson prose, plans, and Q&A mirror into it automatically.
- Structure inside a topic note: the learner's own notes stay at the top; each md-log session appends below with a visible session boundary. Present the session's dependency map (mermaid) in chat before teaching — it gets mirrored too.
- One session covers one topic end-to-end; follow-up sessions on the same topic append to the same note.
- At session end: update `Index.md` in the vault — status emoji + one-line progress note for the topic.

## Status

`/home/md/Documents/backend/Index.md` is the single source of truth for topic status (replaces the retired `progress/progress.md`). The roadmap file stays the phase plan.
