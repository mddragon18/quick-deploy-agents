"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = void 0;
exports.validateRequired = validateRequired;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const req = []; //will add when needed
function validateRequired() {
    for (let i = 0; i < req.length; i++) {
        if (req[i] in process.env) {
            if (typeof process.env[req[i]] === "undefined")
                throw new Error(`${req[i]} is not set`);
        }
        else {
            throw new Error(`${req[i]} is not in env`);
        }
    }
}
exports.PORT = Number(process.env.PORT) || 3000;
//# sourceMappingURL=index.js.map