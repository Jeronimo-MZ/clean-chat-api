import { Hasher } from "@/data/protocols/cryptography";
import { LoadUserByUsernameRepository } from "@/data/protocols/database";
import { UsernameInUseError } from "@/domain/errors";
import { User } from "@/domain/models";
import { AddUser } from "@/domain/usecases";

export class DbAddUser implements AddUser {
    constructor(
        private readonly hasher: Hasher,
        private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
    ) {}

    async add({
        password,
        username,
    }: AddUser.Params): Promise<User | UsernameInUseError> {
        await this.loadUserByUsernameRepository.loadByUsername(username);
        await this.hasher.hash(password);
        return new UsernameInUseError();
    }
}
