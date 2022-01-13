import faker from "@faker-js/faker";

import { CompareFieldsValidation } from "@/validation/validators";

const field = faker.random.word();
const fieldToCompare = faker.random.word();

const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation(field, fieldToCompare);
};

describe("CompareFieldsValidation", () => {
    it("should return null if validation succeeds", () => {
        const sut = makeSut();
        const value = faker.random.word();
        const error = sut.validate({
            [field]: value,
            [fieldToCompare]: value,
        });
        expect(error).toBeNull();
    });
});
