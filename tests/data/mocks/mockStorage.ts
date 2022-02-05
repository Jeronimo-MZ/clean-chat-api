import faker from "@faker-js/faker";

import { DeleteFile, SaveFile } from "@/data/protocols/storage";

export class SaveFileSpy implements SaveFile {
    file: Buffer;
    fileName: string;
    output: SaveFile.Output = faker.system.filePath();
    callsCount = 0;

    async save({ file, fileName }: SaveFile.Input): Promise<SaveFile.Output> {
        this.file = file;
        this.fileName = fileName;
        this.callsCount++;
        return this.output;
    }
}

export class DeleteFileMock implements DeleteFile {
    fileName: string;
    callsCount = 0;

    async delete({ fileName }: DeleteFile.Input): Promise<void> {
        this.fileName = fileName;
        this.callsCount++;
    }
}
