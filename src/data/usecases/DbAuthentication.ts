import { HashComparer } from "@/data/protocols/cryptography";
import { LoadUserByUsernameRepository } from "@/data/protocols/database";
import { InvalidCredentialsError } from "@/domain/errors";
import { Authentication } from "@/domain/usecases";

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
        private readonly hashComparer: HashComparer,
    ) {}
    async auth({
        username,
        password,
    }: Authentication.Input): Promise<Authentication.Output> {
        const user = await this.loadUserByUsernameRepository.loadByUsername(
            username,
        );
        if (user) await this.hashComparer.compare(password, user.password);
        return new InvalidCredentialsError();
    }
}
