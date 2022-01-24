import faker from "@faker-js/faker";

import { ObjectIdValidatorSpy } from "@/tests/validation/mocks";
import { ObjectIdValidation } from "@/validation/validators/ObjectIdValidation";

const field = faker.random.word();

type SutTypes = {
    sut: ObjectIdValidation;
    objectIdValidatorSpy: ObjectIdValidatorSpy;
};

const makeSut = (): SutTypes => {
    const objectIdValidatorSpy = new ObjectIdValidatorSpy();

    const sut = new ObjectIdValidation(field, objectIdValidatorSpy);
    return { sut, objectIdValidatorSpy };
};

describe("ObjectId Validation", () => {
    it("should call ObjectIdValidator with correct value", () => {
        const { sut, objectIdValidatorSpy } = makeSut();
        const value = faker.random.alphaNumeric(12);
        sut.validate({ [field]: value });
        expect(objectIdValidatorSpy.input).toBe(value);
    });
});
