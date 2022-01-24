export class InvalidObjectIdError extends Error {
    constructor(fieldName: string) {
        super(`'${fieldName}' is an invalid object Id.`);
        this.name = "InvalidObjectIdError";
    }
}
