import { Validation } from "@/validation/protocols";
import { ValidationBuilder, ValidationComposite } from "@/validation/validators";

export const makeSearchUsersByUsernameValidation = (): Validation => {
    const usernameValidations = ValidationBuilder.field("username").required().username().build();

    const pageValidations = ValidationBuilder.field("page").integer().min(1, { isNumber: true }).build();

    const pageSizeValidations = ValidationBuilder.field("pageSize").integer().min(1, { isNumber: true }).build();

    return new ValidationComposite([...usernameValidations, ...pageValidations, ...pageSizeValidations]);
};
