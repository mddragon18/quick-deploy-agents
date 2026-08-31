"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    PORT: zod_1.z.coerce.number().int().positive(),
    DB_URL: zod_1.z.url()
});
exports.env = envSchema.parse(process.env);
//# sourceMappingURL=index.js.map