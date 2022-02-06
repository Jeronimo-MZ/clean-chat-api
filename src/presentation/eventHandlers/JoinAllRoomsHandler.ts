import { Socket } from "socket.io";

import { LoadUserByToken } from "@/domain/usecases";
import { EventHandler } from "@/presentation/helpers";

export class JoinAllRoomsHandler
    implements EventHandler<JoinAllRoomsHandler.Data>
{
    constructor(private readonly loadUserByToken: LoadUserByToken) {}

    async handle(
        socket: Socket,
        { accessToken }: JoinAllRoomsHandler.Data,
    ): Promise<void> {
        const userOrError = await this.loadUserByToken.load({ accessToken });
        if (userOrError instanceof Error) {
            delete userOrError.stack;
            socket.emit("client_error", userOrError);
        }
    }
}

export namespace JoinAllRoomsHandler {
    export type Data = {
        accessToken: string;
    };
}
