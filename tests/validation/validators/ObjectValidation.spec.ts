import faker from "@faker-js/faker";

import { ValidationSpy } from "@/tests/validation/mocks";
import { InvalidObjectError } from "@/validation/errors";
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

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });

    it("should return InvalidObjectError if field is not an object", () => {
        const { sut } = makeSut();
        const error = sut.validate({ [field]: faker.datatype.number() });
        expect(error).toEqual(new InvalidObjectError(field));
    });
});
