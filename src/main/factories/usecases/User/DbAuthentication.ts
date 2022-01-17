import { DbAuthentication } from "@/data/usecases";
import { Authentication } from "@/domain/usecases";
import { BcryptAdapter, JwtAdapter } from "@/infra/cryptography";
import { UserMongoRepository } from "@/infra/database/mongodb";
import { env } from "@/main/config";

export const makeDbAuthentication = (): Authentication => {
    const salt = 12;
    const userMongoRepository = new UserMongoRepository();
    const bcryptAdapter = new BcryptAdapter(salt);
    const jwtAdapter = new JwtAdapter(env.secret);
    return new DbAuthentication(
        userMongoRepository,
        bcryptAdapter,
        jwtAdapter,
        userMongoRepository,
    );
};
