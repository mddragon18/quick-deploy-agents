import {z} from "zod";

export const AgentSchema = z.object({
    id : z.uuid().readonly(),
    name : z.string().min(2).max(25),
    description : z.string().optional(),
    createdAt : z.date().readonly(),
    updatedAt : z.date()
});

export type Agent = z.infer<typeof AgentSchema>;
export const CreateAgentSchema = AgentSchema.pick({name:true , description:true});
export const UpdateAgentSchema = AgentSchema.pick({name:true , description:true}).partial();
export type CreateAgentDto = z.infer<typeof CreateAgentSchema>;
export type UpdateAgentDto = z.infer<typeof UpdateAgentSchema>;


// export interface Agent {
//     readonly id: string;
//     name: string;
//     description?: string;
//     readonly createdAt: Date;
//     updatedAt: Date;
// }

// export type CreateAgentDto = Pick<Agent,"name" | "description">
// export type UpdateAgentDto = Partial<Pick<Agent,"name"|"description">>;



