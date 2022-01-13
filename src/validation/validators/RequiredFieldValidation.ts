import { Validation } from "@/validation/protocols";

import { RequiredFieldError } from "../errors";

export class RequiredFieldValidation implements Validation {
    constructor(private readonly fieldName: string) {}
    validate(_input: Validation.Input): RequiredFieldError | null {
        return null;
    }
}
