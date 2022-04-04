import { ObjectIdValidatorAdapter } from "@/infra/validators";
import { makeSendPrivateMessageValidation } from "@/main/factories";
import { ValidationBuilder, ValidationComposite } from "@/validation/validators";

// userId: string;
// roomId: string;
// content: string;
describe("SendPrivateMessageValidationFactory", () => {
    it("should make ValidationComposite with correct validations", () => {
        const sendPrivateMessageValidation = makeSendPrivateMessageValidation();

        const objectIdValidator = new ObjectIdValidatorAdapter();
        const userIdValidations = ValidationBuilder.field("userId").required().objectId(objectIdValidator).build();

        const roomIdValidations = ValidationBuilder.field("roomId").required().objectId(objectIdValidator).build();
        const contentValidations = ValidationBuilder.field("content").required().min(1).build();
        expect(sendPrivateMessageValidation).toEqual(
            new ValidationComposite([...userIdValidations, ...roomIdValidations, ...contentValidations]),
        );
    });
});
