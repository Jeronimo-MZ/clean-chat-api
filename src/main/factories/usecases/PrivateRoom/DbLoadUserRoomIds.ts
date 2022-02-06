import { DbLoadUserRoomIds } from "@/data/usecases";
import { PrivateRoomMongoRepository } from "@/infra/database/mongodb";

export const makeDbLoadUserRoomIds = (): DbLoadUserRoomIds => {
    const privateRoomMongoRepository = new PrivateRoomMongoRepository();
    return new DbLoadUserRoomIds(privateRoomMongoRepository);
};
