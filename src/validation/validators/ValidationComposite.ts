import { RequiredFieldError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class ValidationComposite implements Validation {
    constructor(private readonly validations: Validation[]) {}
    validate(_input: Validation.Input): RequiredFieldError | null {
        return null;
    }
}
