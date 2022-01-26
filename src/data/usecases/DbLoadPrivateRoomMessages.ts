import {
    LoadMessagesByPrivateRoomIdRepository,
    LoadPrivateRoomByIdRepository,
} from "@/data/protocols/database";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";

export class DbLoadPrivateRoomMessages implements LoadPrivateRoomMessages {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
        private readonly loadMessagesByPrivateRoomIdRepository: LoadMessagesByPrivateRoomIdRepository,
    ) {}

    async loadMessages({
        roomId,
        page,
        pageSize,
    }: LoadPrivateRoomMessages.Input): Promise<LoadPrivateRoomMessages.Output> {
        const room = await this.loadPrivateRoomByIdRepository.loadById(roomId);
        if (!room) return new RoomNotFoundError();
        await this.loadMessagesByPrivateRoomIdRepository.loadMessages({
            page,
            pageSize,
            roomId,
        });
        return new UserNotInRoomError();
    }
}
