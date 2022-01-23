import { LoadPrivateRoomByIdRepository } from "@/data/protocols/database";
import { RoomNotFoundError } from "@/domain/errors";
import { SendPrivateMessage } from "@/domain/usecases";

export class DbSendPrivateMessage implements SendPrivateMessage {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
    ) {}

    async send({
        roomId,
    }: SendPrivateMessage.Input): Promise<SendPrivateMessage.Output> {
        const room = await this.loadPrivateRoomByIdRepository.loadById(roomId);
        if (!room) return new RoomNotFoundError();
        return undefined as any;
    }
}
