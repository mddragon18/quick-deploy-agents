import { AppError } from "./AppError";

export class AuthRequiredError extends AppError {
    constructor() {
        super("Authentication Required",401)
    }
}