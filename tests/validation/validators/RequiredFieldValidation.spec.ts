import faker from "@faker-js/faker";

import { RequiredFieldError } from "@/validation/errors";
import { RequiredFieldValidation } from "@/validation/validators";

const field = faker.random.word();

const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation(field);
};

describe("RequiredField Validation", () => {
    it("should return null if validation succeeds", () => {
        const sut = makeSut();
        const error = sut.validate({ [field]: faker.random.word() });
        expect(error).toBeNull();
    });

    it("should return RequiredFieldError if validation fails", () => {
        const sut = makeSut();
        const error = sut.validate({ invalidField: faker.random.word() });
        expect(error).toEqual(new RequiredFieldError(field));
    });
});
