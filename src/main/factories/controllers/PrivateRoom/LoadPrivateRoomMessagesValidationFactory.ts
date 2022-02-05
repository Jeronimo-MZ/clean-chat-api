import { ObjectIdValidatorAdapter } from "@/infra/validators";
import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeLoadPrivateRoomMessagesValidation = (): Validation => {
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
    return new ValidationComposite([
        ...userId,
        ...roomId,
        ...page,
        ...pageSize,
    ]);
};
