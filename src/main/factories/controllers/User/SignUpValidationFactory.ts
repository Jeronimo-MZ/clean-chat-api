import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeSignUpValidation = (): Validation => {
    const usernameValidations = ValidationBuilder.field("username")
        .required()
        .username()
        .build();

    const nameValidations = ValidationBuilder.field("name")
        .required()
        .min(3)
        .build();

    const passwordValidations = ValidationBuilder.field("password")
        .required()
        .min(6)
        .build();
    const passwordConfirmationValidations = ValidationBuilder.field(
        "passwordConfirmation",
    )
        .required()
        .min(6)
        .equals("password")
        .build();

    return new ValidationComposite([
        ...usernameValidations,
        ...nameValidations,
        ...passwordValidations,
        ...passwordConfirmationValidations,
    ]);
};
