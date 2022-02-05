import faker from "@faker-js/faker";

import { ValidationSpy } from "@/tests/validation/mocks";
import { InvalidObjectError, RequiredFieldError } from "@/validation/errors";
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

    it("should return InvalidObjectError with correct error if any validation fails", () => {
        const { sut, validationSpies } = makeSut();
        validationSpies[1].error = new RequiredFieldError(
            faker.database.column(),
        );
        const error = sut.validate({ [field]: faker.helpers.userCard() });
        expect(error).toEqual(
            new InvalidObjectError(field, validationSpies[1].error),
        );
    });
});
