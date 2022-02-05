import { ObjectIdValidatorAdapter } from "@/infra/validators";
import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeSendPrivateMessageValidation = (): Validation => {
    const objectIdValidator = new ObjectIdValidatorAdapter();
    return new ValidationComposite([
        ...ValidationBuilder.field("userId")
            .required()
            .objectId(objectIdValidator)
            .build(),
        ...ValidationBuilder.field("roomId")
            .required()
            .objectId(objectIdValidator)
            .build(),
        ...ValidationBuilder.field("content").required().min(1).build(),
    ]);
};
