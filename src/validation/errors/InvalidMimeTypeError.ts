export class InvalidMimeTypeError extends Error {
    constructor(field: string, allowed: string[]) {
        super(`'${field}' is an unsupported file. Allowed extensions: ${allowed.join(", ")}`);
        this.name = "InvalidMimeTypeError";
    }
}
