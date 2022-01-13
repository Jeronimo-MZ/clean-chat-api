import faker from "@faker-js/faker";

import { ValidationSpy } from "@/tests/validation/mocks";
import { RequiredFieldError } from "@/validation/errors";
import { ValidationComposite } from "@/validation/validators";

const field = faker.random.word();
type SutTypes = {
    sut: ValidationComposite;
    validationSpies: ValidationSpy[];
};

const makeSut = (): SutTypes => {
    const validationSpies = [
        new ValidationSpy(),
        new ValidationSpy(),
        new ValidationSpy(),
    ];
    const sut = new ValidationComposite(validationSpies);
    return {
        sut,
        validationSpies,
    };
};

describe("Validation Composite", () => {
    it("should return null if validation succeeds", () => {
        const { sut } = makeSut();
        const error = sut.validate({ [field]: faker.random.word() });
        expect(error).toBeNull();
    });

    it("should return an error if any validation fails", () => {
        const { sut, validationSpies } = makeSut();
        validationSpies[1].error = new RequiredFieldError(field);
        const error = sut.validate({ [field]: faker.random.word() });
        expect(error).toEqual(validationSpies[1].error);
    });

    it("should return the first error if more than one validation fails", () => {
        const { sut, validationSpies } = makeSut();
        validationSpies[1].error = new Error();
        validationSpies[2].error = new RequiredFieldError(field);
        const error = sut.validate({ [field]: faker.random.word() });
        expect(error).toEqual(validationSpies[1].error);
    });
});
