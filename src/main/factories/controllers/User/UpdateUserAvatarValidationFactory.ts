import { ObjectIdValidatorAdapter } from "@/infra/validators";
import { Validation } from "@/validation/protocols";
import {
    ValidationBuilder,
    ValidationComposite,
} from "@/validation/validators";

export const makeUpdateUserAvatarValidation = (): Validation => {
    const fileValidations = [
        ...ValidationBuilder.field("buffer").required().maxFileSize(5).build(),
        ...ValidationBuilder.field("mimetype")
            .required()
            .allowedMimetypes(["jpg", "png"])
            .build(),
    ];
    const objectIdValidator = new ObjectIdValidatorAdapter();

    return new ValidationComposite([
        ...ValidationBuilder.field("userId")
            .required()
            .objectId(objectIdValidator)
            .build(),
        ...ValidationBuilder.field("file")
            .required()
            .object(fileValidations)
            .build(),
    ]);
};
