import { LoadPrivateRoomByIdRepository } from "@/data/protocols/database";
import { SendPrivateMessage } from "@/domain/usecases";

export class DbSendPrivateMessage implements SendPrivateMessage {
    constructor(
        private readonly loadPrivateRoomByIdRepository: LoadPrivateRoomByIdRepository,
    ) {}

    async send({
        roomId,
    }: SendPrivateMessage.Input): Promise<SendPrivateMessage.Output> {
        await this.loadPrivateRoomByIdRepository.loadById(roomId);
        return undefined as any;
    }
}
