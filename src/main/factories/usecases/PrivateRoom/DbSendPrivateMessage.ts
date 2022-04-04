import { DbSendPrivateMessage } from "@/data/usecases";
import { SendPrivateMessage } from "@/domain/usecases";
import { PrivateRoomMongoRepository } from "@/infra/database/mongodb";
import { SocketIoAdapter } from "@/infra/events";
import { io } from "@/main/config/socket";

export const makeDbSendPrivateMessage = (): SendPrivateMessage => {
    const privateRoomRepository = new PrivateRoomMongoRepository();
    return new DbSendPrivateMessage(privateRoomRepository, privateRoomRepository, new SocketIoAdapter(io));
};
