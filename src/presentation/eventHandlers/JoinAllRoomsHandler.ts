import { Socket } from "socket.io";

import { LoadUserByToken } from "@/domain/usecases";
import { EventHandler } from "@/presentation/helpers";

export class JoinAllRoomsHandler
    implements EventHandler<JoinAllRoomsHandler.Data>
{
    constructor(private readonly loadUserByToken: LoadUserByToken) {}

    async handle(
        _socket: Socket,
        { accessToken }: JoinAllRoomsHandler.Data,
    ): Promise<void> {
        await this.loadUserByToken.load({ accessToken });
        return undefined as any;
    }
}

export namespace JoinAllRoomsHandler {
    export type Data = {
        accessToken: string;
    };
}
