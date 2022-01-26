import { LoadPrivateRoomByIdRepository } from "@/data/protocols/database";
import { RoomNotFoundError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";

export class DbLoadPrivateRoomMessages implements LoadPrivateRoomMessages {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
    ) {}

    async loadMessages({
        roomId,
    }: LoadPrivateRoomMessages.Input): Promise<LoadPrivateRoomMessages.Output> {
        this.loadPrivateRoomByIdRepository.loadById(roomId);
        return new RoomNotFoundError();
    }
}
