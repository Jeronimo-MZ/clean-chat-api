import faker from "@faker-js/faker";

import { SaveFile } from "@/data/protocols/storage";

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
