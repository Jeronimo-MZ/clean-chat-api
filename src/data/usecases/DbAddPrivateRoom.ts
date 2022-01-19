import {
    AddPrivateRoomRepository,
    LoadUserByIdRepository,
} from "@/data/protocols/database";
import { UserNotFoundError } from "@/domain/errors";
import { PrivateRoom } from "@/domain/models";
import { AddPrivateRoom } from "@/domain/usecases";

export class DbAddPrivateRoom implements AddPrivateRoom {
    constructor(
        private readonly loadUserByIdRepository: LoadUserByIdRepository,
        private readonly addPrivateRoomRepository: AddPrivateRoomRepository,
    ) {}
    async add({
        otherUserId,
        currentUserId,
    }: AddPrivateRoom.Input): Promise<PrivateRoom | UserNotFoundError> {
        await this.loadUserByIdRepository.loadById(otherUserId);
        await this.addPrivateRoomRepository.add([currentUserId, otherUserId]);
        return new UserNotFoundError();
    }
}
