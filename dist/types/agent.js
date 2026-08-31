"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAgentSchema = exports.CreateAgentSchema = exports.AgentSchema = void 0;
const zod_1 = require("zod");
exports.AgentSchema = zod_1.z.object({
    id: zod_1.z.string().readonly(),
    name: zod_1.z.string().min(2).max(25),
    description: zod_1.z.string().optional(),
    createdAt: zod_1.z.date().readonly(),
    updatedAt: zod_1.z.date()
});
exports.CreateAgentSchema = exports.AgentSchema.pick({ name: true, description: true });
exports.UpdateAgentSchema = exports.AgentSchema.pick({ name: true, description: true }).partial();
// export interface Agent {
//     readonly id: string;
//     name: string;
//     description?: string;
//     readonly createdAt: Date;
//     updatedAt: Date;
// }
// export type CreateAgentDto = Pick<Agent,"name" | "description">
// export type UpdateAgentDto = Partial<Pick<Agent,"name"|"description">>;
//# sourceMappingURL=agent.js.map