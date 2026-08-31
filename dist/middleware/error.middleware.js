"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
const ValidationError_1 = require("../errors/ValidationError");
function errorHandler(err, req, res, next) {
    if (err instanceof ValidationError_1.ValidationError) {
        return res.status(err.statusCode).json({
            message: err.message,
            required_fields: err.required_fields,
            required_types: err.required_types
        });
    }
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            message: err.message
        });
    }
    console.error(err);
    return res.status(500).json({
        message: "Internal Server Error"
    });
}
//# sourceMappingURL=error.middleware.js.map