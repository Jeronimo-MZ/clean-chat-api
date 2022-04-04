import { UUIDGenerator } from "@/data/protocols/cryptography";
import { LoadUserByIdRepository, UpdateUserAvatarRepository } from "@/data/protocols/database";
import { DeleteFile, SaveFile } from "@/data/protocols/storage";
import { UserNotFoundError } from "@/domain/errors";
import { UpdateUserAvatar } from "@/domain/usecases";

export class DbUpdateUserAvatar implements UpdateUserAvatar {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
        private readonly uuidGenerator: UUIDGenerator,
        private readonly saveFile: SaveFile,
        private readonly updateUserAvatarRepository: UpdateUserAvatarRepository,
        private readonly deleteFile: DeleteFile,
    ) {}
    async update({ userId, file }: UpdateUserAvatar.Input): Promise<UpdateUserAvatar.Output> {
        const user = await this.loadUserByIdRepository.loadById(userId);
        if (!user) return new UserNotFoundError();
        const key = this.uuidGenerator.generate();
        const oldAvatar = user.avatar;
        const fileName = await this.saveFile.save({
            file: file.buffer,
            fileName: `${key}.${file.mimeType.split("/")[1]}`,
        });
        await this.updateUserAvatarRepository.updateAvatar({
            userId: user.id,
            avatar: fileName,
        });
        if (oldAvatar) await this.deleteFile.delete({ fileName: oldAvatar });
        return { avatarUrl: fileName };
    }
}
