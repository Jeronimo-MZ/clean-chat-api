import {
    AddPrivateMessageRepository,
    LoadPrivateRoomByIdRepository,
} from "@/data/protocols/database";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { SendPrivateMessage } from "@/domain/usecases";

export class DbSendPrivateMessage implements SendPrivateMessage {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
        private readonly addPrivateMessageRepository: AddPrivateMessageRepository,
    ) {}

    async send({
        roomId,
        content,
        senderId,
    }: SendPrivateMessage.Input): Promise<SendPrivateMessage.Output> {
        const room = await this.loadPrivateRoomByIdRepository.loadById(roomId);
        if (!room) return new RoomNotFoundError();
        await this.addPrivateMessageRepository.addMessage({
            message: { content, senderId },
            roomId,
        });
        return new UserNotInRoomError();
    }
}
