"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const AppError_1 = require("../errors/AppError");
function errorHandler(err, req, res, next) {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            message: "Agent not found"
        });
    }
    console.error(err);
    return res.status(500).json({
        message: "Internal Server Error"
    });
}
//# sourceMappingURL=error.middleware.js.map