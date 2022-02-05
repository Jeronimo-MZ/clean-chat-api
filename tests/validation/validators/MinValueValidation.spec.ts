import faker from "@faker-js/faker";

import { MinValueError } from "@/validation/errors";
import { MinValueValidation } from "@/validation/validators";

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

    it("should return null if value is greater than min value", () => {
        const { sut } = makeSut();
        const error = sut.validate({
            [field]: minValue + 1,
        });
        expect(error).toBeNull();
    });

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });

    it("should return an MinValueError if value is lesser than min value", () => {
        const { sut } = makeSut();
        const error = sut.validate({
            [field]: minValue - 1,
        });
        expect(error).toEqual(new MinValueError(field, minValue));
    });
});
