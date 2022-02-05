import { UUIDGenerator } from "@/data/protocols/cryptography";
import { LoadUserByIdRepository } from "@/data/protocols/database";
import { UserNotFoundError } from "@/domain/errors";
import { UpdateUserAvatar } from "@/domain/usecases";

export class DbUpdateUserAvatar implements UpdateUserAvatar {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
        private readonly uuidGenerator: UUIDGenerator,
    ) {}
    async update({
        userId,
    }: UpdateUserAvatar.Input): Promise<UpdateUserAvatar.Output> {
        await this.loadUserByIdRepository.loadById(userId);
        this.uuidGenerator.generate();
        return new UserNotFoundError();
    }
}
