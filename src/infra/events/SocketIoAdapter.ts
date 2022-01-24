import { Server } from "socket.io";

import { SendMessage } from "@/data/protocols/event";

import { EventTypes } from "./EventTypes";

export class SocketIoAdapter implements SendMessage {
    constructor(private readonly io: Server) {}
    sendMessage(input: SendMessage.Input): void {
        this.io.to(input.roomId).emit(EventTypes.NEW_MESSAGE, input.message);
    }
}
