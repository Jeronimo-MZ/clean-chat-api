import { PrivateRoom, User } from "@/domain/models";

export interface addPrivateRoom {
    add(data: addPrivateRoom.Input): Promise<addPrivateRoom.Output>;
}
export namespace addPrivateRoom {
    export type Input = {
        participants: [User, User];
    };

    export type Output = PrivateRoom;
}
