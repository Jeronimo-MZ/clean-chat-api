import { MinValueError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { Validation } from "@/validation/protocols";

export class MinValueValidation implements Validation {
    constructor(readonly field: string, private readonly minValue: number) {}
    validate(input: Validation.Input): MinValueError | null {
        return isAbsent(input[this.field]) || (input[this.field] as number) >= this.minValue
            ? null
            : new MinValueError(this.field, this.minValue);
    }
}
