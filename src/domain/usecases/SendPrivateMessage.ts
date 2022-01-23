import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { PrivateRoomMessage } from "@/domain/models";

export interface SendPrivateMessage {
    send(input: SendPrivateMessage.Input): Promise<SendPrivateMessage.Output>;
}

export namespace SendPrivateMessage {
    export type Input = {
        senderId: string;
        roomId: string;
        content: string;
    };
    export type Output =
        | {
              roomId: string;
              message: PrivateRoomMessage;
          }
        | UserNotInRoomError
        | RoomNotFoundError;
}
