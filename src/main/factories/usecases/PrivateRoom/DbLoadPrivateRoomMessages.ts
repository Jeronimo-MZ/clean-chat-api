import { DbLoadPrivateRoomMessages } from "@/data/usecases";
import { PrivateRoomMongoRepository } from "@/infra/database/mongodb";

export const makeDbLoadPrivateRoomMessages = (): DbLoadPrivateRoomMessages => {
    const privateRoomMongoRepository = new PrivateRoomMongoRepository();
    return new DbLoadPrivateRoomMessages(
        privateRoomMongoRepository,
        privateRoomMongoRepository,
    );
};
