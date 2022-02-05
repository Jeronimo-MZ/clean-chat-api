import faker from "@faker-js/faker";

import { InvalidMimeTypeError } from "@/validation/errors";
import { AllowedMimeTypesValidation } from "@/validation/validators";

const field = faker.random.word();

describe("AllowedMimeType Validation", () => {
    it("should return InvalidMimeTypeError if value is invalid", () => {
        const sut = new AllowedMimeTypesValidation(["jpg"], field);
        const error = sut.validate({ [field]: "image/png" });
        expect(error).toEqual(new InvalidMimeTypeError(field, ["jpg"]));
    });

    it("should return InvalidMimeTypeError if value is invalid", () => {
        const sut = new AllowedMimeTypesValidation(["png"], field);
        const error = sut.validate({ [field]: "image/jpg" });
        expect(error).toEqual(new InvalidMimeTypeError(field, ["png"]));
    });

    it("should return null if value is valid", () => {
        const sut = new AllowedMimeTypesValidation(["png"], field);
        const error = sut.validate({ [field]: "image/png" });
        expect(error).toBeNull();
    });

    it("should return null if value is valid", () => {
        const sut = new AllowedMimeTypesValidation(["jpg"], field);
        const error = sut.validate({ [field]: "image/jpg" });
        expect(error).toBeNull();
    });

    it("should return null if value is valid", () => {
        const sut = new AllowedMimeTypesValidation(["jpg"], field);
        const error = sut.validate({ [field]: "image/jpeg" });
        expect(error).toBeNull();
    });

    it("should return null if no value is given", () => {
        const sut = new AllowedMimeTypesValidation([], field);
        const error = sut.validate({});
        expect(error).toBeNull();
    });
});
