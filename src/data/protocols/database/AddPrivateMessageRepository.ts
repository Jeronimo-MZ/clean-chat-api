import { PrivateRoomMessage } from "@/domain/models";

export interface AddPrivateMessageRepository {
    addMessage(input: AddPrivateMessageRepository.Input): Promise<AddPrivateMessageRepository.Output>;
}

export namespace AddPrivateMessageRepository {
    export type Input = {
        roomId: string;
        message: {
            content: string;
            senderId: string;
        };
    };
    export type Output = {
        message: PrivateRoomMessage;
    };
}
