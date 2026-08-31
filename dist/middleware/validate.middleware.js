"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = validateBody;
const zod_validation_error_1 = require("zod-validation-error");
function validateBody(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: (0, zod_validation_error_1.fromZodError)(result.error)
            });
        }
        req.body = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map