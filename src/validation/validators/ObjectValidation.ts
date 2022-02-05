import { Validation } from "@/validation/protocols";

import { InvalidObjectError } from "../errors";
import { isAbsent } from "../helpers";

export class ObjectValidation implements Validation {
    constructor(
        private readonly fieldname: string,
        private readonly validations: Validation[],
    ) {}

    validate(input: Validation.Input): InvalidObjectError | null {
        const value = input[this.fieldname];
        if (!isAbsent(value))
            if (typeof value != "object")
                return new InvalidObjectError(this.fieldname);
        return null;
    }
}
