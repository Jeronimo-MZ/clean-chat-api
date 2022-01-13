import faker from "@faker-js/faker";

import { MinLengthValidation } from "@/validation/validators";

const field = faker.random.word();
const minLength = 5;

type SutTypes = {
    sut: MinLengthValidation;
};

const makeSut = (): SutTypes => {
    const sut = new MinLengthValidation(field, minLength);
    return {
        sut,
    };
};

describe("Min Length Validation", () => {
    it("should return null if value length equals min length", () => {
        const { sut } = makeSut();
        const error = sut.validate({
            [field]: faker.random.alphaNumeric(minLength),
        });
        expect(error).toBeNull();
    });

    it("should return an null if value length is greater than min length", () => {
        const { sut } = makeSut();
        const error = sut.validate({
            [field]: faker.random.alphaNumeric(minLength + 1),
        });
        expect(error).toBeNull();
    });
});
