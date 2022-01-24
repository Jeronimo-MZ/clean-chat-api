import { ObjectIdValidator, Validation } from "@/validation/protocols";

export class ObjectIdValidation implements Validation {
    constructor(
        private readonly field: string,
        private readonly objectIdValidator: ObjectIdValidator,
    ) {}
    validate(input: Validation.Input): Error | null {
        this.objectIdValidator.isValid(input[this.field]);
        return null;
    }
}
