import { MinValueError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class MinValueValidation implements Validation {
    constructor(readonly field: string, private readonly minValue: number) {}
    validate(_input: Validation.Input): MinValueError | null {
        return null;
    }
}
