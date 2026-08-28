import { AppError } from "./AppError";

export class ValidationError extends AppError {
    constructor(
        message:string,
        statusCode:number,
        public required_fields:string[],
        public required_types : string[]
    ) {
        super(message,statusCode);
    }
}