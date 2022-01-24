import { ObjectIdValidatorAdapter } from "@/infra/validators/ObjectIdValidatorAdapter";
import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeAddPrivateRoomValidation = (): Validation => {
    const objectIdValidator = new ObjectIdValidatorAdapter();
    return new ValidationComposite([
        ...ValidationBuilder.field("userId")
            .required()
            .objectId(objectIdValidator)
            .build(),
        ...ValidationBuilder.field("otherUserId")
            .required()
            .objectId(objectIdValidator)
            .build(),
    ]);
};
