import { Server } from "socket.io";

import { SendMessage } from "@/data/protocols/event";

export class SocketIoAdapter implements SendMessage {
    constructor(private readonly io: Server) {}
    sendMessage(input: SendMessage.Input): void {
        this.io.to(input.roomId);
    }
}
