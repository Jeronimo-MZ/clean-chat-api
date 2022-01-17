import faker from "@faker-js/faker";

import { DbLoadUserByToken } from "@/data/usecases";
import { InvalidTokenError } from "@/domain/errors";
import { DecrypterSpy } from "@/tests/data/mocks";
import { throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbLoadUserByToken;
    decrypterSpy: DecrypterSpy;
};

const token = faker.datatype.uuid();

const makeSut = (): SutTypes => {
    const decrypterSpy = new DecrypterSpy();
    const sut = new DbLoadUserByToken(decrypterSpy);

    return {
        sut,
        decrypterSpy,
    };
};

describe("DbLoadUserByToken", () => {
    it("should call Decrypter with correct value", async () => {
        const { sut, decrypterSpy } = makeSut();
        await sut.load({ accessToken: token });
        expect(decrypterSpy.ciphertext).toBe(token);
        expect(decrypterSpy.callsCount).toBe(1);
    });

    it("should throw if Decrypter throws", async () => {
        const { sut, decrypterSpy } = makeSut();
        jest.spyOn(decrypterSpy, "decrypt").mockImplementationOnce(throwError);
        const promise = sut.load({ accessToken: token });
        await expect(promise).rejects.toThrow();
    });

    it("should return InvalidTokenError if Decrypter returns null", async () => {
        const { sut, decrypterSpy } = makeSut();
        decrypterSpy.plaintext = null;
        const user = await sut.load({ accessToken: token });
        expect(user).toEqual(new InvalidTokenError());
    });
});
