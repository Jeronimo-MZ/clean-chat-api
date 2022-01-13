import faker from "@faker-js/faker";

import { NotMatchingFieldsError } from "@/validation/errors";
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

    it("should return NotMatchingFieldsError if validation fails", () => {
        const sut = makeSut();
        const error = sut.validate({
            [field]: faker.random.word(),
            [fieldToCompare]: faker.random.word(),
        });
        expect(error).toEqual(
            new NotMatchingFieldsError(field, fieldToCompare),
        );
    });
});
