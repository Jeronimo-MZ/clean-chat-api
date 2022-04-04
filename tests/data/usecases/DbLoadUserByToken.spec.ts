import faker from "@faker-js/faker";

import { DbLoadUserByToken } from "@/data/usecases";
import { InvalidTokenError } from "@/domain/errors";
import { DecrypterSpy, LoadUserByTokenRepositorySpy } from "@/tests/data/mocks";
import { throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbLoadUserByToken;
    decrypterSpy: DecrypterSpy;
    loadUserByTokenRepositorySpy: LoadUserByTokenRepositorySpy;
};

const accessToken = faker.datatype.uuid();

const makeSut = (): SutTypes => {
    const loadUserByTokenRepositorySpy = new LoadUserByTokenRepositorySpy();
    const decrypterSpy = new DecrypterSpy();
    const sut = new DbLoadUserByToken(decrypterSpy, loadUserByTokenRepositorySpy);

    return {
        sut,
        decrypterSpy,
        loadUserByTokenRepositorySpy,
    };
};

describe("DbLoadUserByToken", () => {
    it("should call Decrypter with correct value", async () => {
        const { sut, decrypterSpy } = makeSut();
        await sut.load({ accessToken });
        expect(decrypterSpy.ciphertext).toBe(accessToken);
        expect(decrypterSpy.callsCount).toBe(1);
    });

    it("should throw if Decrypter throws", async () => {
        const { sut, decrypterSpy } = makeSut();
        jest.spyOn(decrypterSpy, "decrypt").mockImplementationOnce(throwError);
        const promise = sut.load({ accessToken });
        await expect(promise).rejects.toThrow();
    });

    it("should return InvalidTokenError if Decrypter returns null", async () => {
        const { sut, decrypterSpy } = makeSut();
        decrypterSpy.plaintext = null;
        const user = await sut.load({ accessToken });
        expect(user).toEqual(new InvalidTokenError());
    });

    it("should call LoadUserByTokenRepository with correct token", async () => {
        const { sut, loadUserByTokenRepositorySpy } = makeSut();
        await sut.load({ accessToken });
        expect(loadUserByTokenRepositorySpy.token).toBe(accessToken);
        expect(loadUserByTokenRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if LoadUserByTokenRepository throws", async () => {
        const { sut, loadUserByTokenRepositorySpy } = makeSut();
        jest.spyOn(loadUserByTokenRepositorySpy, "loadByToken").mockImplementationOnce(throwError);
        const promise = sut.load({ accessToken });
        await expect(promise).rejects.toThrow();
    });

    it("should not call LoadUserByTokenRepository if Decrypter returns null", async () => {
        const { sut, decrypterSpy, loadUserByTokenRepositorySpy } = makeSut();
        decrypterSpy.plaintext = null;
        await sut.load({ accessToken });
        expect(decrypterSpy.callsCount).toBe(1);
        expect(loadUserByTokenRepositorySpy.callsCount).toBe(0);
    });

    it("should return a user on success", async () => {
        const { sut, loadUserByTokenRepositorySpy } = makeSut();
        const user = await sut.load({ accessToken });
        expect(user).toEqual(loadUserByTokenRepositorySpy.result);
    });
});
