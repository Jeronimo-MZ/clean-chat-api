import { makeLoginValidation } from "@/main/factories";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

describe("LoginValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const signUpValidation = makeLoginValidation();
        const usernameValidations = ValidationBuilder.field("username")
            .required()
            .username()
            .build();

        const passwordValidations = ValidationBuilder.field("password")
            .required()
            .min(6)
            .build();

        expect(signUpValidation).toEqual(
            new ValidationComposite([
                ...usernameValidations,
                ...passwordValidations,
            ]),
        );
    });
});
