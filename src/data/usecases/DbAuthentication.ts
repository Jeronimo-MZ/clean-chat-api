import { HashComparer } from "@/data/protocols/cryptography";
import { LoadUserByUsernameRepository } from "@/data/protocols/database";
import { InvalidCredentialsError } from "@/domain/errors";
import { Authentication } from "@/domain/usecases";
import { EncrypterSpy } from "@/tests/data/mocks";

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypterSpy: EncrypterSpy,
    ) {}
    async auth({
        username,
        password,
    }: Authentication.Input): Promise<Authentication.Output> {
        const user = await this.loadUserByUsernameRepository.loadByUsername(
            username,
        );
        if (user) {
            const isValid = await this.hashComparer.compare(
                password,
                user.password,
            );
            if (isValid) await this.encrypterSpy.encrypt(user.id);
        }
        return new InvalidCredentialsError();
    }
}
