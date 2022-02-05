import { LoadUserByIdRepository } from "@/data/protocols/database";
import { UserNotFoundError } from "@/domain/errors";
import { UpdateUserAvatar } from "@/domain/usecases";

export class DbUpdateUserAvatar implements UpdateUserAvatar {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
    ) {}
    async update({
        userId,
    }: UpdateUserAvatar.Input): Promise<UpdateUserAvatar.Output> {
        await this.loadUserByIdRepository.loadById(userId);
        return new UserNotFoundError();
    }
}
