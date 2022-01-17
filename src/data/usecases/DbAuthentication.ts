import { Encrypter, HashComparer } from "@/data/protocols/cryptography";
import {
    LoadUserByUsernameRepository,
    UpdateAccessTokenRepository,
} from "@/data/protocols/database";
import { InvalidCredentialsError } from "@/domain/errors";
import { Authentication } from "@/domain/usecases";

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypterSpy: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    ) {}
    async auth({
        username,
        password,
    }: Authentication.Input): Promise<Authentication.Output> {
        const user = await this.loadUserByUsernameRepository.loadByUsername(
            username,
        );
        if (!user) return new InvalidCredentialsError();
        const isValid = await this.hashComparer.compare(
            password,
            user.password,
        );
        if (!isValid) return new InvalidCredentialsError();
        const token = await this.encrypterSpy.encrypt(user.id);
        await this.updateAccessTokenRepository.updateAccessToken(
            user.id,
            token,
        );

        return { token };
    }
}
