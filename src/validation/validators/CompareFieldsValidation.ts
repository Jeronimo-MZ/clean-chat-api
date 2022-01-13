import { NotMatchingFieldsError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class CompareFieldsValidation implements Validation {
    constructor(
        private readonly field: string,
        private readonly fieldToCompare: string,
    ) {}

    validate(_input: Validation.Input): NotMatchingFieldsError | null {
        return null;
    }
}
