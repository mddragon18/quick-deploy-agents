"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MalformedRequestError = void 0;
const ValidationError_1 = require("./ValidationError");
class MalformedRequestError extends ValidationError_1.ValidationError {
    constructor(message, required_fields, required_types) {
        super(message, 422, required_fields, required_types);
    }
}
exports.MalformedRequestError = MalformedRequestError;
//# sourceMappingURL=MalformedRequestError.js.map