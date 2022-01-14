import { InvalidCredentialsError } from "@/domain/errors";
import { Authentication } from "@/domain/usecases";

import { LoadUserByUsernameRepository } from "../protocols/database";

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    ) {}
    async auth({
        username,
    }: Authentication.Input): Promise<Authentication.Output> {
        await this.loadUserByUsernameRepository.loadByUsername(username);
        return new InvalidCredentialsError();
    }
}
