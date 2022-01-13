import { NotMatchingFieldsError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class CompareFieldsValidation implements Validation {
    constructor(
        private readonly field: string,
        private readonly fieldToCompare: string,
    ) {}

    validate(input: Validation.Input): NotMatchingFieldsError | null {
        return input[this.field] === input[this.fieldToCompare]
            ? null
            : new NotMatchingFieldsError(this.field, this.fieldToCompare);
    }
}
