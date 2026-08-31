"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSchema = void 0;
const zod_1 = require("zod");
exports.MessageSchema = zod_1.z.object({
    from: zod_1.z.enum(["user", "agent"]),
    content: zod_1.z.string().min(1)
});
// enum Sender {
//     user="user",
//     agent="agent"
// }
// export interface Message {
//     from : Sender,
//     content : string
// }
//# sourceMappingURL=message.js.map