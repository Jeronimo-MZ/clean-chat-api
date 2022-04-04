import { DbUpdateUserAvatar } from "@/data/usecases";
import { UpdateUserAvatar } from "@/domain/usecases";
import { UUIDAdapter } from "@/infra/cryptography";
import { UserMongoRepository } from "@/infra/database/mongodb";
import { DiskStorage } from "@/infra/storage";
import { env } from "@/main/config";

export const makeDbUpdateUserAvatar = (): UpdateUserAvatar => {
    const userMongoRepository = new UserMongoRepository();
    const diskStorage = new DiskStorage(env.staticFilesPath);
    const uuidAdapter = new UUIDAdapter();
    return new DbUpdateUserAvatar(userMongoRepository, uuidAdapter, diskStorage, userMongoRepository, diskStorage);
};
