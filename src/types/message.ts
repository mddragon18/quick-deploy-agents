import {z} from "zod";

export const MessageSchema = z.object({
    id : z.uuid().readonly(),
    conversationId : z.uuid().readonly(),
    from : z.enum(["user","agent"]),
    content : z.string().min(1),
    createdAt : z.date().readonly(),
    updatedAt : z.date()
})

export type Message = z.infer<typeof MessageSchema>
export const CreateMessageSchema = MessageSchema.pick({from:true, content:true});
export type CreateMessageDto = z.infer<typeof CreateMessageSchema>; 

// enum Sender {
//     user="user",
//     agent="agent"
// }

// export interface Message {
//     from : Sender,
//     content : string
// }
