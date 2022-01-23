import {
    AddPrivateMessageRepository,
    LoadPrivateRoomByIdRepository,
} from "@/data/protocols/database";
import { SendMessage } from "@/data/protocols/event";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { SendPrivateMessage } from "@/domain/usecases";

export class DbSendPrivateMessage implements SendPrivateMessage {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
        private readonly addPrivateMessageRepository: AddPrivateMessageRepository,
        private readonly sendMessage: SendMessage,
    ) {}

    async send({
        roomId,
        content,
        senderId,
    }: SendPrivateMessage.Input): Promise<SendPrivateMessage.Output> {
        const room = await this.loadPrivateRoomByIdRepository.loadById(roomId);
        if (!room) return new RoomNotFoundError();
        if (!room.participants.includes(senderId))
            return new UserNotInRoomError();
        const { message } = await this.addPrivateMessageRepository.addMessage({
            message: { content, senderId },
            roomId,
        });
        this.sendMessage.sendMessage({
            message,
            roomId,
        });
        return undefined as any;
    }
}
