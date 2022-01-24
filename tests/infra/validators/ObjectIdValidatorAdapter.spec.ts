import faker from "@faker-js/faker";
import { ObjectId } from "mongodb";

import { ObjectIdValidatorAdapter } from "@/infra/validators/ObjectIdValidatorAdapter";

jest.mock("mongodb");

const makeSut = (): ObjectIdValidatorAdapter => {
    const sut = new ObjectIdValidatorAdapter();
    return sut;
};

describe("ObjectIdValidatorAdapter", () => {
    it("it should call ObjectId.isValid with correct value", () => {
        const sut = makeSut();
        const isValidSpy = jest.spyOn(ObjectId, "isValid");
        const input = faker.random.word();
        sut.isValid(input);
        expect(isValidSpy).toHaveBeenNthCalledWith(1, input);
    });

    it("should return false if ObjectId.isValid returns false", () => {
        const sut = makeSut();
        jest.spyOn(ObjectId, "isValid").mockReturnValueOnce(false);
        const isValid = sut.isValid(faker.random.word());
        expect(isValid).toBe(false);
    });

    it("should return true if ObjectId.isValid returns true", () => {
        const sut = makeSut();
        jest.spyOn(ObjectId, "isValid").mockReturnValueOnce(true);
        const isValid = sut.isValid(faker.random.word());
        expect(isValid).toBe(true);
    });
});
