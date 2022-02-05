export class InvalidBufferError extends Error {
    constructor(fieldName: string) {
        super(`'${fieldName}' must be a Buffer.`);
        this.name = "InvalidBufferError";
    }
}
