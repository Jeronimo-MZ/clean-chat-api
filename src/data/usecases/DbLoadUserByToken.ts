import { Decrypter } from "@/data/protocols/cryptography";
import { InvalidTokenError } from "@/domain/errors";
import { LoadUserByToken } from "@/domain/usecases";

export class DbLoadUserByToken implements LoadUserByToken {
    constructor(private readonly decrypter: Decrypter) {}
    async load({
        accessToken,
    }: LoadUserByToken.Input): Promise<LoadUserByToken.Output> {
        await this.decrypter.decrypt(accessToken);
        return new InvalidTokenError();
    }
}
