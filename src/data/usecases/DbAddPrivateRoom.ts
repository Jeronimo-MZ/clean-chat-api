import { LoadUserByIdRepository } from "@/data/protocols/database";
import { PrivateRoom } from "@/domain/models";
import { AddPrivateRoom } from "@/domain/usecases";

export class DbAddPrivateRoom implements AddPrivateRoom {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
    ) {}
    async add({ otherUserId }: AddPrivateRoom.Input): Promise<PrivateRoom> {
        await this.loadUserByIdRepository.loadById(otherUserId);
        return undefined as any;
    }
}
