export class MaxFileSizeError extends Error {
    constructor(field: string, maxSizeInMb: number) {
        super(`'${field}' is invalid. File upload limit is ${maxSizeInMb}MB`);
    }
}
