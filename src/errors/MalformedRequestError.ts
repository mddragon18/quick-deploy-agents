import { ValidationError } from "./ValidationError";

export class MalformedRequestError extends ValidationError {
    constructor(
        message:string,
        required_fields:string[],
        required_types : string[]
    ) {
        super(message,422,required_fields,required_types);
    }
}