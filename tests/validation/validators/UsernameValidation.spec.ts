import faker from "@faker-js/faker";

import { InvalidUsernameError } from "@/validation/errors";
import { UsernameValidation } from "@/validation/validators";

type SutTypes = {
    sut: UsernameValidation;
};

const field = faker.random.word();
const makeSut = (): SutTypes => {
    const sut = new UsernameValidation(field);
    return { sut };
};

describe("UsernameValidation", () => {
    it("should return null if a valid username is provided", () => {
        const { sut } = makeSut();
        expect(sut.validate({ [field]: "user_name" })).toBeNull();
        expect(sut.validate({ [field]: "__username" })).toBeNull();
        expect(sut.validate({ [field]: "__username__" })).toBeNull();
        expect(sut.validate({ [field]: "username__" })).toBeNull();
        expect(sut.validate({ [field]: "user.name" })).toBeNull();
        expect(sut.validate({ [field]: "user.n4me" })).toBeNull();
        expect(sut.validate({ [field]: "username" })).toBeNull();
    });

    it("should return InvalidUsernameError if an invalid username is provided", () => {
        const { sut } = makeSut();
        expect(sut.validate({ [field]: "user name" })).toEqual(
            new InvalidUsernameError(field),
        );
        expect(sut.validate({ [field]: "" })).toEqual(
            new InvalidUsernameError(field),
        );
        expect(sut.validate({ [field]: "aa" })).toEqual(
            new InvalidUsernameError(field),
        );
        expect(sut.validate({ [field]: "username$" })).toEqual(
            new InvalidUsernameError(field),
        );
    });

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });
});
