import { LoadUserByIdRepository } from "@/data/protocols/database";
import { UserNotFoundError } from "@/domain/errors";
import { PrivateRoom } from "@/domain/models";
import { AddPrivateRoom } from "@/domain/usecases";

export class DbAddPrivateRoom implements AddPrivateRoom {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
    ) {}
    async add({
        otherUserId,
    }: AddPrivateRoom.Input): Promise<PrivateRoom | UserNotFoundError> {
        await this.loadUserByIdRepository.loadById(otherUserId);
        return new UserNotFoundError();
    }
}
