import { Server } from "socket.io";

import { DbSendPrivateMessage } from "@/data/usecases";
import { SendPrivateMessage } from "@/domain/usecases";
import { PrivateRoomMongoRepository } from "@/infra/database/mongodb";
import { SocketIoAdapter } from "@/infra/events/SocketIoAdapter";

export const makeDbSendPrivateMessage = (io: Server): SendPrivateMessage => {
    const privateRoomRepository = new PrivateRoomMongoRepository();
    return new DbSendPrivateMessage(
        privateRoomRepository,
        privateRoomRepository,
        new SocketIoAdapter(io),
    );
};
