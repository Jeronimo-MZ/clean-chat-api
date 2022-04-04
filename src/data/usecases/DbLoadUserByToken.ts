import { Decrypter } from "@/data/protocols/cryptography";
import { LoadUserByTokenRepository } from "@/data/protocols/database";
import { InvalidTokenError } from "@/domain/errors";
import { LoadUserByToken } from "@/domain/usecases";

export class DbLoadUserByToken implements LoadUserByToken {
    constructor(
        private readonly decrypter: Decrypter,
        private readonly loadUserByTokenRepository: LoadUserByTokenRepository,
    ) {}
    async load({ accessToken }: LoadUserByToken.Input): Promise<LoadUserByToken.Output> {
        const isValid = !!(await this.decrypter.decrypt(accessToken));
        if (isValid) {
            const user = await this.loadUserByTokenRepository.loadByToken(accessToken);
            if (user) return user;
        }
        return new InvalidTokenError();
    }
}
