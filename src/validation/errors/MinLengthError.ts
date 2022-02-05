export class MinLengthError extends Error {
    constructor(field: string, minLength: number) {
        super(`'${field}' is invalid. Its minimum length is: ${minLength}`);
        this.name = "MinLengthError";
    }
}
