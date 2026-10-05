import { AppError } from "./AppError";

export class InvalidCredentialsError extends AppError {
    constructor(message : string) {
        super(message,401)
    }
}