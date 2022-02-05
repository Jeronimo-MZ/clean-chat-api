import faker from "@faker-js/faker";

import { throwError } from "@/tests/domain/mocks";
import { ObjectIdValidatorSpy } from "@/tests/validation/mocks";
import { InvalidObjectIdError } from "@/validation/errors";
import { ObjectIdValidation } from "@/validation/validators";

const field = faker.random.word();
const value = faker.random.alphaNumeric(12);

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
        sut.validate({ [field]: value });
        expect(objectIdValidatorSpy.input).toBe(value);
    });

    it("should return null if ObjectIdValidator returns true", () => {
        const { sut } = makeSut();
        const error = sut.validate({ [field]: value });
        expect(error).toBeNull();
    });

    it("should throw if ObjectIdValidator throws", () => {
        const { sut, objectIdValidatorSpy } = makeSut();
        jest.spyOn(objectIdValidatorSpy, "isValid").mockImplementationOnce(
            throwError,
        );
        expect(() => sut.validate({ [field]: value })).toThrowError();
    });

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });

    it("should return InvaliObjectIdError if ObjectIdValidator returns false", () => {
        const { sut, objectIdValidatorSpy } = makeSut();
        objectIdValidatorSpy.result = false;
        const error = sut.validate({ [field]: value });
        expect(error).toEqual(new InvalidObjectIdError(field));
    });
});
