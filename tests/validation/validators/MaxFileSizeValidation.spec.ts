import faker from "@faker-js/faker";

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
        const buffer = Buffer.from(
            new ArrayBuffer(convertMbToBytes(maxSizeInMb)),
        );
        const error = sut.validate({ [field]: buffer });
        expect(error).toBeNull();
    });
});
