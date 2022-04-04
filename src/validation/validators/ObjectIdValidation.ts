import { InvalidObjectIdError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { ObjectIdValidator, Validation } from "@/validation/protocols";

export class ObjectIdValidation implements Validation {
    constructor(private readonly field: string, private readonly objectIdValidator: ObjectIdValidator) {}
    validate(input: Validation.Input): InvalidObjectIdError | null {
        return isAbsent(input[this.field]) || this.objectIdValidator.isValid(input[this.field])
            ? null
            : new InvalidObjectIdError(this.field);
    }
}
