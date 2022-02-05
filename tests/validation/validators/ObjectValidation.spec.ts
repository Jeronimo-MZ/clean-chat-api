import faker from "@faker-js/faker";

import { ValidationSpy } from "@/tests/validation/mocks";
import { ObjectValidation } from "@/validation/validators";

const field = faker.random.word();
type SutTypes = {
    sut: ObjectValidation;
    validationSpies: ValidationSpy[];
};

const makeSut = (): SutTypes => {
    const validationSpies = [
        new ValidationSpy(),
        new ValidationSpy(),
        new ValidationSpy(),
    ];
    const sut = new ObjectValidation(field, validationSpies);
    return {
        sut,
        validationSpies,
    };
};

describe("ObjectValidation", () => {
    it("should return null if a valid object is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({ [field]: faker.helpers.userCard() });
        expect(error).toBeNull();
    });

    it("should return null if field is not provided", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });
});
