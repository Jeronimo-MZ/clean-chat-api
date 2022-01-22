import faker from "@faker-js/faker";

import { MinValueValidation } from "@/validation/validators/MinValueValidation";

const field = faker.random.word();
const minValue = faker.datatype.number();

type SutTypes = {
    sut: MinValueValidation;
};

const makeSut = (): SutTypes => {
    const sut = new MinValueValidation(field, minValue);
    return {
        sut,
    };
};

describe("MinValueValidation", () => {
    it("should return null if value equals min value", () => {
        const { sut } = makeSut();
        const error = sut.validate({
            [field]: minValue,
        });
        expect(error).toBeNull();
    });
});
