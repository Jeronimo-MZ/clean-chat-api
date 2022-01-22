import { DbSearchUsersByUsername } from "@/data/usecases";
import { SearchUsersByUsername } from "@/domain/usecases";
import { UserMongoRepository } from "@/infra/database/mongodb";

export const makeDbSearchUsersByUsername = (): SearchUsersByUsername => {
    const userMongoRepository = new UserMongoRepository();
    return new DbSearchUsersByUsername(userMongoRepository);
};
