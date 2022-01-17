import faker from "@faker-js/faker";

import { DbLoadUserByToken } from "@/data/usecases";
import { DecrypterSpy } from "@/tests/data/mocks";

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
});
