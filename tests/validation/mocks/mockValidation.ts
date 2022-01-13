import { Validation } from "@/validation/protocols";

export class ValidationSpy implements Validation {
    error: Error | null = null;
    input: Validation.Input;

    validate(input: Validation.Input): Error | null {
        this.input = input;
        return this.error;
    }
}
