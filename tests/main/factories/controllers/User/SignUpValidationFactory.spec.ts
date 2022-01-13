import { makeSignUpValidation } from "@/main/factories";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

describe("SignUpValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const signUpValidation = makeSignUpValidation();
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

        expect(signUpValidation).toEqual(
            new ValidationComposite([
                ...usernameValidations,
                ...nameValidations,
                ...passwordValidations,
                ...passwordConfirmationValidations,
            ]),
        );
    });
});
