import { Validation } from "@/validation/protocols";

export class ValidationComposite implements Validation {
    constructor(private readonly validations: Validation[]) {}
    validate(input: Validation.Input): Error | null {
        for (const validation of this.validations) {
            const error = validation.validate(input);
            if (error) return error;
        }
        return null;
    }
}
