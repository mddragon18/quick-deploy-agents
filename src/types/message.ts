import {z} from "zod";

export const MessageSchema = z.object({
    from : z.enum(["user","agent"]),
    content : z.string().min(1)
})

export type Message = z.infer<typeof MessageSchema>


// enum Sender {
//     user="user",
//     agent="agent"
// }

// export interface Message {
//     from : Sender,
//     content : string
// }
