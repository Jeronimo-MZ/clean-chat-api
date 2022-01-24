import { ObjectIdValidatorAdapter } from "@/infra/validators/ObjectIdValidatorAdapter";
import { makeAddPrivateRoomValidation } from "@/main/factories";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

describe("AddPrivateRoomValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const addPrivateRoomValidation = makeAddPrivateRoomValidation();
        const objectIdValidator = new ObjectIdValidatorAdapter();
        const userIdValidations = ValidationBuilder.field("userId")
            .required()
            .objectId(objectIdValidator)
            .build();

        const otherUserIdValidations = ValidationBuilder.field("otherUserId")
            .required()
            .objectId(objectIdValidator)
            .build();
        expect(addPrivateRoomValidation).toEqual(
            new ValidationComposite([
                ...userIdValidations,
                ...otherUserIdValidations,
            ]),
        );
    });
});
