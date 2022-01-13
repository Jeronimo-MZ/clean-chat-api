import { ValidationError } from "./ValidationError";

export class RequiredFieldError extends ValidationError {
    constructor(fieldName: string) {
        super(`'${fieldName}' is required.`);
        this.name = "RequiredFieldError";
    }
}
