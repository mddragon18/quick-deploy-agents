import {z} from "zod";
import { MessageSchema } from "./message";

export const ConversationSchema = z.object({
    id : z.string(),
    agent_id : z.string(),
    messages : z.array(MessageSchema)
})

export type Conversation = z.infer<typeof ConversationSchema>

// import { Message } from "./message";

// export interface Conversation {
//     id : string,
//     agent_id:string,
//     messages : Message[]
// }

