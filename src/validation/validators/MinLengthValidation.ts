import { MinLengthError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class MinLengthValidation implements Validation {
    constructor(readonly field: string, private readonly minLength: number) {}
    validate(_input: Validation.Input): MinLengthError | null {
        return null;
    }
}
