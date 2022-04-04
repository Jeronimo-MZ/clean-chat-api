import { RequiredFieldError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class RequiredFieldValidation implements Validation {
    constructor(private readonly fieldName: string) {}
    validate(input: Validation.Input): RequiredFieldError | null {
        return input[this.fieldName] ? null : new RequiredFieldError(this.fieldName);
    }
}
