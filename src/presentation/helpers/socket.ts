import { Socket } from "socket.io";

export interface EventHandler<InputData = any> {
    handle(socket: Socket, data: InputData): Promise<void>;
}
