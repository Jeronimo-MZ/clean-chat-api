export class RequiredFieldError extends Error {
    constructor(fieldName: string) {
        super(`'${fieldName}' is required.`);
        this.name = "RequiredFieldError";
    }
}
