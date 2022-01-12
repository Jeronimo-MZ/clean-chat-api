import faker from "@faker-js/faker";
import bcrypt from "bcrypt";

import { BcryptAdapter } from "@/infra/cryptography/BcryptAdapter";
import { throwError } from "@/tests/domain/mocks";

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

    it("should throw if bcrypt throws", async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, "hash").mockImplementationOnce(throwError);
        const promise = sut.hash(plaintext);
        await expect(promise).rejects.toThrow();
    });

    it("should return a valid hash on success", async () => {
        const sut = makeSut();
        const hash = await sut.hash(plaintext);
        expect(hash).toBe(generatedHash);
    });
});
