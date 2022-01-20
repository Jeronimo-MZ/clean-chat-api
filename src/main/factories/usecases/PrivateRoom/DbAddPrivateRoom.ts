import { DbAddPrivateRoom } from "@/data/usecases";
import {
    PrivateRoomMongoRepository,
    UserMongoRepository,
} from "@/infra/database/mongodb";

export const makeAddPrivateRoom = (): DbAddPrivateRoom => {
    const userMongoRepository = new UserMongoRepository();
    const privateRoomMongoRepository = new PrivateRoomMongoRepository();
    return new DbAddPrivateRoom(
        userMongoRepository,
        privateRoomMongoRepository,
    );
};
