import { makeAddPrivateRoomValidation } from "@/main/factories";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

describe("LoginValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const addPrivateRoomValidation = makeAddPrivateRoomValidation();
        const userIdValidations = ValidationBuilder.field("userId")
            .required()
            .build();

        const otherUserIdValidations = ValidationBuilder.field("otherUserId")
            .required()
            .build();

        expect(addPrivateRoomValidation).toEqual(
            new ValidationComposite([
                ...userIdValidations,
                ...otherUserIdValidations,
            ]),
        );
    });
});
