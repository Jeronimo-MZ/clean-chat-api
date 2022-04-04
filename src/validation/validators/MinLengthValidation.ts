import { MinLengthError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { Validation } from "@/validation/protocols";

export class MinLengthValidation implements Validation {
    constructor(readonly field: string, private readonly minLength: number) {}
    validate(input: Validation.Input): MinLengthError | null {
        return isAbsent(input[this.field]) || (input[this.field] as string).length >= this.minLength
            ? null
            : new MinLengthError(this.field, this.minLength);
    }
}
