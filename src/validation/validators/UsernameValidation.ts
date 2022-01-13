import { InvalidUsernameError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class UsernameValidation implements Validation {
    constructor(private readonly fieldName: string) {}
    validate(input: Validation.Input): InvalidUsernameError | null {
        const regex = /^_*\w[\w\d_.]+[\w\d_]$/;

        return regex.test(input[this.fieldName])
            ? null
            : new InvalidUsernameError(this.fieldName);
    }
}
