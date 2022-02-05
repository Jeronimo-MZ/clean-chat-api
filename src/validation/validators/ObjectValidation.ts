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
        if (!isAbsent(value)) {
            if (typeof value != "object")
                return new InvalidObjectError(this.fieldname);
            for (const validation of this.validations) {
                const error = validation.validate(value as any);
                if (error) return new InvalidObjectError(this.fieldname, error);
            }
        }
        return null;
    }
}
