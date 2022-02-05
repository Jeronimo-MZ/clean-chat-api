export class InvalidObjectError extends Error {
    constructor(fieldName: string, error?: Error) {
        const end = error ? `: ${error.message}` : "";
        super(`'${fieldName}' is an invalid object${end}`);
        this.name = "InvalidObjectError";
    }
}
