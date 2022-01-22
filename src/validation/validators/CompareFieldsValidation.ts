import { NotMatchingFieldsError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

import { isAbsent } from "../helpers";

export class CompareFieldsValidation implements Validation {
    constructor(
        private readonly field: string,
        private readonly fieldToCompare: string,
    ) {}

    validate(input: Validation.Input): NotMatchingFieldsError | null {
        return isAbsent(input[this.field]) ||
            input[this.field] === input[this.fieldToCompare]
            ? null
            : new NotMatchingFieldsError(this.field, this.fieldToCompare);
    }
}
