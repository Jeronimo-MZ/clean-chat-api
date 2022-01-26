import { LoadPrivateRoomByIdRepository } from "@/data/protocols/database";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";

export class DbLoadPrivateRoomMessages implements LoadPrivateRoomMessages {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
    ) {}

    async loadMessages({
        roomId,
    }: LoadPrivateRoomMessages.Input): Promise<LoadPrivateRoomMessages.Output> {
        const room = await this.loadPrivateRoomByIdRepository.loadById(roomId);
        if (!room) return new RoomNotFoundError();
        return new UserNotInRoomError();
    }
}
