import { Validation } from "@/validation/protocols";
import {
    MinLengthValidation,
    RequiredFieldValidation,
} from "@/validation/validators";

import { CompareFieldsValidation } from "./CompareFieldsValidation";
import { UsernameValidation } from "./UsernameValidation";

export class ValidationBuilder {
    private constructor(
        private readonly fieldName: string,
        private readonly validations: Validation[],
    ) {}

    static field(fieldName: string): ValidationBuilder {
        return new ValidationBuilder(fieldName, []);
    }

    required(): ValidationBuilder {
        this.validations.push(new RequiredFieldValidation(this.fieldName));
        return this;
    }

    min(length: number): ValidationBuilder {
        this.validations.push(new MinLengthValidation(this.fieldName, length));
        return this;
    }

    username(): ValidationBuilder {
        this.validations.push(new UsernameValidation(this.fieldName));
        return this;
    }

    equals(fieldToCompare: string): ValidationBuilder {
        this.validations.push(
            new CompareFieldsValidation(this.fieldName, fieldToCompare),
        );
        return this;
    }

    build(): Validation[] {
        return this.validations;
    }
}
