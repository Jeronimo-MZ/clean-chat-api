import { ObjectIdValidatorAdapter } from "@/infra/validators/ObjectIdValidatorAdapter";
import { makeLoadPrivateRoomMessagesValidation } from "@/main/factories";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

describe("LoadPrivateRoomMessagesValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const loadPrivateRoomMessagesValidation =
            makeLoadPrivateRoomMessagesValidation();
        const objectIdValidator = new ObjectIdValidatorAdapter();
        const userId = ValidationBuilder.field("userId")
            .required()
            .objectId(objectIdValidator)
            .build();
        const roomId = ValidationBuilder.field("roomId")
            .required()
            .objectId(objectIdValidator)
            .build();
        const page = ValidationBuilder.field("page")
            .integer()
            .min(1, { isNumber: true })
            .build();
        const pageSize = ValidationBuilder.field("pageSize")
            .integer()
            .min(1, { isNumber: true })
            .build();

        expect(loadPrivateRoomMessagesValidation).toEqual(
            new ValidationComposite([
                ...userId,
                ...roomId,
                ...page,
                ...pageSize,
            ]),
        );
    });
});
