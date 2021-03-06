import faker from "@faker-js/faker";

import { MaxFileSizeError } from "@/validation/errors";
import { InvalidBufferError } from "@/validation/errors/InvalidBufferError";
import { MaxFileSizeValidation } from "@/validation/validators";

type SutTypes = {
    sut: MaxFileSizeValidation;
};
const field = faker.random.word();
const maxSizeInMb = faker.datatype.number({ min: 0, max: 1000 });

const makeSut = (): SutTypes => {
    const sut = new MaxFileSizeValidation(maxSizeInMb, field);
    return {
        sut,
    };
};

const convertMbToBytes = (sizeInMb: number): number => {
    return sizeInMb * 1024 * 1024;
};

describe("MaxFileSize Validation", () => {
    it("should return null if size equals maxFileSize", () => {
        const { sut } = makeSut();
        const buffer = Buffer.from(new ArrayBuffer(convertMbToBytes(maxSizeInMb)));
        const error = sut.validate({ [field]: buffer });
        expect(error).toBeNull();
    });

    it("should return null if size is lesser than maxFileSize", () => {
        const { sut } = makeSut();
        const buffer = Buffer.from(new ArrayBuffer(convertMbToBytes(maxSizeInMb - 1)));
        const error = sut.validate({ [field]: buffer });
        expect(error).toBeNull();
    });

    it("should return null if no value is given", () => {
        const { sut } = makeSut();
        const error = sut.validate({});
        expect(error).toBeNull();
    });

    it("should return InvalidBufferError if field is not a Buffer", () => {
        const { sut } = makeSut();
        const error = sut.validate({ [field]: faker.datatype.number() });
        expect(error).toEqual(new InvalidBufferError(field));
    });

    it("should return MaxFileSizeError if size is greater than maxFileSize", () => {
        const { sut } = makeSut();
        const buffer = Buffer.from(new ArrayBuffer(convertMbToBytes(maxSizeInMb + 1)));
        const error = sut.validate({ [field]: buffer });
        expect(error).toEqual(new MaxFileSizeError(field, maxSizeInMb));
    });
});
