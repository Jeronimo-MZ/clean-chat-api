import faker from "@faker-js/faker";

import { InvalidIntegerError } from "@/validation/errors";
import { IntegerValidation } from "@/validation/validators";

type SutTypes = {
    sut: IntegerValidation;
};

const field = faker.random.word();
const makeSut = (): SutTypes => {
    const sut = new IntegerValidation(field);
    return { sut };
};

describe("IntegerValidation", () => {
    it("should return null if a valid integer is provided", () => {
        const { sut } = makeSut();
        expect(sut.validate({ [field]: Math.round(faker.datatype.number()) })).toBeNull();
    });

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });

    it("should return InvalidIntegerError if a float is given", async () => {
        const { sut } = makeSut();
        let error = sut.validate({ [field]: Math.random() * 1000 });
        expect(error).toEqual(new InvalidIntegerError(field));
        error = sut.validate({ [field]: faker.random.alphaNumeric() });
        expect(error).toEqual(new InvalidIntegerError(field));
    });
});
