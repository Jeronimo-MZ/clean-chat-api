import { MinValueError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

import { isAbsent } from "../helpers";

export class MinValueValidation implements Validation {
    constructor(readonly field: string, private readonly minValue: number) {}
    validate(input: Validation.Input): MinValueError | null {
        return isAbsent(input[this.field]) ||
            (input[this.field] as number) >= this.minValue
            ? null
            : new MinValueError(this.field, this.minValue);
    }
}
