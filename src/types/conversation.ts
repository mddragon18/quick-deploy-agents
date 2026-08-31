import {z} from "zod";

export const ConversationSchema = z.object({
    id : z.uuid().readonly(),
    agentId : z.string(),
    createdAt : z.date().readonly(),
    updatedAt : z.date()
})

export type Conversation = z.infer<typeof ConversationSchema>

// import { Message } from "./message";

// export interface Conversation {
//     id : string,
//     agent_id:string,
//     messages : Message[]
// }

