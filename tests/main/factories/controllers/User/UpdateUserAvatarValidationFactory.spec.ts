import { ObjectIdValidatorAdapter } from "@/infra/validators";
import { makeUpdateUserAvatarValidation } from "@/main/factories/controllers";
import { ValidationBuilder as builder, ValidationComposite } from "@/validation/validators";

describe("UpdateUserAvatarValidation", () => {
    it("should make ValidationComposite with correct validations", () => {
        const fileValidations = [
            ...builder.field("buffer").required().maxFileSize(5).build(),
            ...builder.field("mimetype").required().allowedMimetypes(["jpg", "png"]).build(),
        ];
        const objectIdValidator = new ObjectIdValidatorAdapter();

        expect(makeUpdateUserAvatarValidation()).toEqual(
            new ValidationComposite([
                ...builder.field("userId").required().objectId(objectIdValidator).build(),
                ...builder.field("file").required().object(fileValidations).build(),
            ]),
        );
    });
});
