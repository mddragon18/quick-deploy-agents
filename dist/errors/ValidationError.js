"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const AppError_1 = require("./AppError");
class ValidationError extends AppError_1.AppError {
    required_fields;
    required_types;
    constructor(message, statusCode, required_fields, required_types) {
        super(message, statusCode);
        this.required_fields = required_fields;
        this.required_types = required_types;
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=ValidationError.js.map