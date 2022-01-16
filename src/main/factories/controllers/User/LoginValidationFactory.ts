import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeLoginValidation = (): Validation => {
    const usernameValidations = ValidationBuilder.field("username")
        .required()
        .username()
        .build();

    const passwordValidations = ValidationBuilder.field("password")
        .required()
        .min(6)
        .build();
    return new ValidationComposite([
        ...usernameValidations,
        ...passwordValidations,
    ]);
};
