import { Socket } from "socket.io";

import { LoadUserByToken, LoadUserRoomIds } from "@/domain/usecases";
import { EventHandler } from "@/presentation/helpers";

export class JoinAllRoomsHandler
    implements EventHandler<JoinAllRoomsHandler.Data>
{
    constructor(
        private readonly loadUserByToken: LoadUserByToken,
        private readonly loadUserRoomIds: LoadUserRoomIds,
    ) {}

    async handle(
        socket: Socket,
        { accessToken }: JoinAllRoomsHandler.Data,
    ): Promise<void> {
        try {
            if (!accessToken) return;
            const userOrError = await this.loadUserByToken.load({
                accessToken,
            });
            if (userOrError instanceof Error) {
                delete userOrError.stack;
                socket.emit("client_error", userOrError);
            } else {
                const { roomIds } = await this.loadUserRoomIds.load({
                    userId: userOrError.id,
                });
                socket.join(roomIds);
            }
        } catch (error) {
            delete (error as Error).stack;
            socket.emit("server_error", error);
        }
    }
}

export namespace JoinAllRoomsHandler {
    export type Data = {
        accessToken: string;
    };
}
