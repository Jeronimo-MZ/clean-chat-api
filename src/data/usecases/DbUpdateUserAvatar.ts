import { UUIDGenerator } from "@/data/protocols/cryptography";
import { LoadUserByIdRepository } from "@/data/protocols/database";
import { SaveFile } from "@/data/protocols/storage";
import { UserNotFoundError } from "@/domain/errors";
import { UpdateUserAvatar } from "@/domain/usecases";

export class DbUpdateUserAvatar implements UpdateUserAvatar {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
        private readonly uuidGenerator: UUIDGenerator,
        private readonly saveFile: SaveFile,
    ) {}
    async update({
        userId,
        file,
    }: UpdateUserAvatar.Input): Promise<UpdateUserAvatar.Output> {
        const user = await this.loadUserByIdRepository.loadById(userId);
        if (user) {
            const key = this.uuidGenerator.generate();
            await this.saveFile.save({
                file: file.buffer,
                fileName: `${key}.${file.mimeType.split("/")[1]}`,
            });
        }
        return new UserNotFoundError();
    }
}
