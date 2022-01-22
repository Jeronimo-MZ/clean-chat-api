export class InvalidIntegerError extends Error {
    constructor(fieldName: string) {
        super(`'${fieldName}' must be integer.`);
        this.name = "InvalidUsernameError";
    }
}
