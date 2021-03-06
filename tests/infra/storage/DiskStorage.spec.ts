import faker from "@faker-js/faker";
import { unlink, writeFile } from "fs/promises";
import path from "path";

import { SaveFile } from "@/data/protocols/storage";
import { DiskStorage } from "@/infra/storage";
import { throwError } from "@/tests/domain/mocks";

jest.mock("fs/promises");

type SutTypes = {
    sut: DiskStorage;
};
const staticFilesDirectory = faker.system.directoryPath();
const fileName = faker.system.fileName();

const makeSut = (): SutTypes => {
    const sut = new DiskStorage(staticFilesDirectory);
    return {
        sut,
    };
};

const makeSaveFileInput = (): SaveFile.Input => ({
    file: Buffer.from(faker.datatype.string()),
    fileName,
});

describe("DiskStorage", () => {
    describe("save()", () => {
        it("should call writeFile with correct values", async () => {
            const { sut } = makeSut();
            const input = makeSaveFileInput();
            await sut.save(input);
            expect(writeFile).toHaveBeenCalledWith(path.resolve(staticFilesDirectory, input.fileName), input.file);
        });

        it("should throw if writeFile throws", async () => {
            const { sut } = makeSut();
            jest.mocked(writeFile).mockImplementationOnce(throwError);
            const input = makeSaveFileInput();
            const promise = sut.save(input);
            await expect(promise).rejects.toThrow();
        });

        it("should return filename on success", async () => {
            const { sut } = makeSut();
            const input = makeSaveFileInput();
            const filename = await sut.save(input);
            expect(filename).toBe(input.fileName);
        });
    });

    describe("delete()", () => {
        it("should call unlink with correct values", async () => {
            const { sut } = makeSut();
            await sut.delete({ fileName });
            expect(unlink).toHaveBeenCalledWith(path.resolve(staticFilesDirectory, fileName));
        });

        it("should throw if unlink throws", async () => {
            const { sut } = makeSut();
            jest.mocked(unlink).mockImplementationOnce(throwError);
            const promise = sut.delete({ fileName });
            await expect(promise).rejects.toThrow();
        });
    });
});
