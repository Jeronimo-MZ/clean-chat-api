import { UserNotFoundError } from "@/domain/errors";
import { PrivateRoom } from "@/domain/models";

export interface AddPrivateRoom {
    add(data: AddPrivateRoom.Input): Promise<AddPrivateRoom.Output>;
}
export namespace AddPrivateRoom {
    export type Input = {
        currentUserId: string;
        otherUserId: string;
    };

    export type Output = PrivateRoom | UserNotFoundError;
}
