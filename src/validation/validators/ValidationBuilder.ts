import { Validation } from "@/validation/protocols";
import { RequiredFieldValidation } from "@/validation/validators";

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

    build(): Validation[] {
        return this.validations;
    }
}
