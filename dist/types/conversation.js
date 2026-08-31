"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationSchema = void 0;
const zod_1 = require("zod");
const message_1 = require("./message");
exports.ConversationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    agent_id: zod_1.z.string(),
    messages: zod_1.z.array(message_1.MessageSchema)
});
// import { Message } from "./message";
// export interface Conversation {
//     id : string,
//     agent_id:string,
//     messages : Message[]
// }
//# sourceMappingURL=conversation.js.map