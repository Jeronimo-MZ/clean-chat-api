import faker from "@faker-js/faker";

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
});
