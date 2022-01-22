import faker from "@faker-js/faker";

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
        expect(
            sut.validate({ [field]: Math.round(faker.datatype.number()) }),
        ).toBeNull();
    });

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });
});
