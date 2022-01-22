import { makeSearchUsersByUsernameValidation } from "@/main/factories/controllers/User/SearchUsersByUsernameValidationFactory";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

describe("SearchUsersByUsernameValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const validation = makeSearchUsersByUsernameValidation();
        const usernameValidations = ValidationBuilder.field("username")
            .required()
            .username()
            .build();

        const pageValidations = ValidationBuilder.field("page")
            .integer()
            .min(1, { isNumber: true })
            .build();

        const pageSizeValidations = ValidationBuilder.field("pageSize")
            .integer()
            .min(1, { isNumber: true })
            .build();

        expect(validation).toEqual(
            new ValidationComposite([
                ...usernameValidations,
                ...pageValidations,
                ...pageSizeValidations,
            ]),
        );
    });
});
