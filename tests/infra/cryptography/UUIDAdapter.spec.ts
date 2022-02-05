import faker from "@faker-js/faker";
import { randomUUID } from "crypto";

import { UUIDAdapter } from "@/infra/cryptography";
import { throwError } from "@/tests/domain/mocks";

const generatedUUID = faker.datatype.uuid();
jest.mock("crypto");
jest.mocked(randomUUID).mockReturnValue(generatedUUID);

const makeSut = () => new UUIDAdapter();

describe("UUIDAdapter", () => {
    it("should call crypto.randomUUID", () => {
        const sut = makeSut();
        sut.generate();
        expect(randomUUID).toHaveBeenCalledTimes(1);
    });

    it("should return correct uuid", () => {
        const sut = makeSut();
        const uuid = sut.generate();
        expect(uuid).toBe(generatedUUID);
    });

    it("should throw if crypto.randomUUID throws", () => {
        const sut = makeSut();
        jest.mocked(randomUUID).mockImplementationOnce(throwError);
        expect(sut.generate).toThrow();
    });
});
