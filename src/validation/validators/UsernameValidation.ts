import { InvalidUsernameError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

import { isAbsent } from "../helpers";

export class UsernameValidation implements Validation {
    constructor(private readonly fieldName: string) {}
    validate(input: Validation.Input): InvalidUsernameError | null {
        const regex = /^_*\w[\w\d_.]+[\w\d_]$/;

        return isAbsent(input[this.fieldName]) ||
            regex.test(input[this.fieldName] as string)
            ? null
            : new InvalidUsernameError(this.fieldName);
    }
}
