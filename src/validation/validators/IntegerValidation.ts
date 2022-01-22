import { InvalidIntegerError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { Validation } from "@/validation/protocols";

export class IntegerValidation implements Validation {
    constructor(readonly field: string) {}
    validate(input: Validation.Input): InvalidIntegerError | null {
        return isAbsent(input[this.field]) ||
            Number.isInteger(input[this.field])
            ? null
            : new InvalidIntegerError(this.field);
    }
}
