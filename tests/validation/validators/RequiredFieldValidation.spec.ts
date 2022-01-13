import faker from "@faker-js/faker";

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
});
