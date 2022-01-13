export class NotMatchingFieldsError extends Error {
    constructor(field: string, fieldToCompare: string) {
        super(`${field} and ${fieldToCompare} have different values`);
        this.name = "NotMatchingFieldsError";
    }
}
