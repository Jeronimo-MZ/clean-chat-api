import faker from "@faker-js/faker";
import { writeFile } from "fs/promises";
import path from "path";

import { SaveFile } from "@/data/protocols/storage";
import { DiskStorage } from "@/infra/storage";

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
            expect(writeFile).toHaveBeenCalledWith(
                path.resolve(staticFilesDirectory, input.fileName),
                input.file,
            );
        });
    });
});
