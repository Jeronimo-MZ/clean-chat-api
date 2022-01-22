import { InvalidIntegerError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class IntegerValidation implements Validation {
    constructor(readonly field: string) {}
    validate(_input: Validation.Input): InvalidIntegerError | null {
        return null;
    }
}
