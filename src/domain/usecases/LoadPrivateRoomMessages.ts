import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { PrivateRoomMessage } from "@/domain/models";

export interface LoadPrivateRoomMessages {
    loadMessages(
        input: LoadPrivateRoomMessages.Input,
    ): Promise<LoadPrivateRoomMessages.Output>;
}

export namespace LoadPrivateRoomMessages {
    export type Input = {
        userId: string;
        roomId: string;
        page: number;
        pageSize: number;
    };
    export type Output =
        | {
              messages: PrivateRoomMessage[];
              roomId: string;
              page: number;
              pageSize: number;
              totalPages: number;
          }
        | UserNotInRoomError
        | RoomNotFoundError;
}
