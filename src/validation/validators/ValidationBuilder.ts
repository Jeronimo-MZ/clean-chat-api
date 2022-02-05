import { ObjectIdValidator, Validation } from "@/validation/protocols";
import {
    MinLengthValidation,
    RequiredFieldValidation,
} from "@/validation/validators";

import {
    AllowedMimeTypesValidation,
    Extension,
} from "./AllowedMimeTypeValidation";
import { CompareFieldsValidation } from "./CompareFieldsValidation";
import { IntegerValidation } from "./IntegerValidation";
import { MaxFileSizeValidation } from "./MaxFileSizeValidation";
import { MinValueValidation } from "./MinValueValidation";
import { ObjectIdValidation } from "./ObjectIdValidation";
import { ObjectValidation } from "./ObjectValidation";
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

    min(value: number, options?: { isNumber: boolean }): ValidationBuilder {
        if (options?.isNumber) {
            this.validations.push(
                new MinValueValidation(this.fieldName, value),
            );
        } else {
            this.validations.push(
                new MinLengthValidation(this.fieldName, value),
            );
        }
        return this;
    }

    username(): ValidationBuilder {
        this.validations.push(new UsernameValidation(this.fieldName));
        return this;
    }

    integer(): ValidationBuilder {
        this.validations.push(new IntegerValidation(this.fieldName));
        return this;
    }

    objectId(objectIdValidator: ObjectIdValidator): ValidationBuilder {
        this.validations.push(
            new ObjectIdValidation(this.fieldName, objectIdValidator),
        );
        return this;
    }

    object(validations: Validation[]): ValidationBuilder {
        this.validations.push(
            new ObjectValidation(this.fieldName, validations),
        );
        return this;
    }

    equals(fieldToCompare: string): ValidationBuilder {
        this.validations.push(
            new CompareFieldsValidation(this.fieldName, fieldToCompare),
        );
        return this;
    }

    maxFileSize(maxSizeInMb: number): ValidationBuilder {
        this.validations.push(
            new MaxFileSizeValidation(maxSizeInMb, this.fieldName),
        );
        return this;
    }
    allowedMimetypes(allowed: Extension[]): ValidationBuilder {
        this.validations.push(
            new AllowedMimeTypesValidation(allowed, this.fieldName),
        );
        return this;
    }

    build(): Validation[] {
        return this.validations;
    }
}
