export class InvalidUsernameError extends Error {
    constructor(fieldName: string) {
        super(`'${fieldName}' is an invalid username.`);
        this.name = "InvalidUsernameError";
    }
}
