import faker from "@faker-js/faker";
import jwt from "jsonwebtoken";

import { JwtAdapter } from "@/infra/cryptography";

const secret = faker.random.alphaNumeric(50);
const plaintext = faker.datatype.uuid();
const token = faker.random.alphaNumeric(50);

jest.mock("jsonwebtoken", () => ({
    sign: () => {
        return token;
    },
    verify: () => {
        return { data: plaintext };
    },
}));

const makeSut = (): JwtAdapter => {
    return new JwtAdapter(secret);
};

describe("JwtAdapter", () => {
    describe("encrypt()", () => {
        it("should call sign with correct values", async () => {
            const sut = makeSut();
            const signSpy = jest.spyOn(jwt, "sign");
            await sut.encrypt(plaintext);
            expect(signSpy).toHaveBeenCalledWith({ data: plaintext }, secret, {
                expiresIn: "1d",
            });
        });
    });
});
