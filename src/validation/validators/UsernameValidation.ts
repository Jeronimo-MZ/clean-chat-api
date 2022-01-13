import { InvalidUsernameError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class UsernameValidation implements Validation {
    constructor(private readonly fieldName: string) {}
    validate(_input: Validation.Input): InvalidUsernameError | null {
        return null;
    }
}
