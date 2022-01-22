export class MinValueError extends Error {
    constructor(field: string, minValue: number) {
        super(`'${field}' is invalid. Its minimum value is: ${minValue}`);
    }
}
