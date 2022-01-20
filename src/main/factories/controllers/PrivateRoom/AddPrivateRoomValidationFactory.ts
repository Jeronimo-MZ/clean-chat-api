import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeAddPrivateRoomValidation = (): Validation => {
    return new ValidationComposite([
        ...ValidationBuilder.field("userId").required().build(),
        ...ValidationBuilder.field("otherUserId").required().build(),
    ]);
};
