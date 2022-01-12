import faker from "@faker-js/faker";
import bcrypt from "bcrypt";

import { BcryptAdapter } from "@/infra/cryptography/BcryptAdapter";

const generatedHash = faker.random.alphaNumeric(30);
const salt = faker.datatype.number();
const plaintext = faker.internet.password();

jest.mock("bcrypt", () => ({
    hash: async (): Promise<string> => generatedHash,
}));

const makeSut = () => new BcryptAdapter(salt);
describe("BcryptAdapter", () => {
    it("should call bcrypt with correct plaintext", async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, "hash");
        await sut.hash(plaintext);
        expect(hashSpy).toHaveBeenCalledWith(plaintext, salt);
    });
});
