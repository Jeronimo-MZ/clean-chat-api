import { Decrypter } from "@/data/protocols/cryptography";
import { InvalidTokenError } from "@/domain/errors";
import { LoadUserByToken } from "@/domain/usecases";

import { LoadUserByTokenRepository } from "../protocols/database";

export class DbLoadUserByToken implements LoadUserByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadUserByTokenRepository: LoadUserByTokenRepository,
    ) {}
    async load({
        accessToken,
    }: LoadUserByToken.Input): Promise<LoadUserByToken.Output> {
        const isValid = !!(await this.decrypter.decrypt(accessToken));
        if (isValid)
            await this.loadUserByTokenRepository.loadByToken(accessToken);
        return new InvalidTokenError();
    }
}
