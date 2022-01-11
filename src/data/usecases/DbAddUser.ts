import { Hasher } from "@/data/protocols/cryptography";
import {
    AddUserRepository,
    LoadUserByUsernameRepository,
} from "@/data/protocols/database";
import { UsernameInUseError } from "@/domain/errors";
import { User } from "@/domain/models";
import { AddUser } from "@/domain/usecases";

export class DbAddUser implements AddUser {
    constructor(
        private readonly hasher: Hasher,
        private readonly loadUserByUsernameRepository: LoadUserByUsernameRepository,
        private readonly addUserRepository: AddUserRepository,
    ) {}

    async add({
        password,
        username,
        name,
    }: AddUser.Params): Promise<User | UsernameInUseError> {
        const user = await this.loadUserByUsernameRepository.loadByUsername(
            username,
        );
        if (user) return new UsernameInUseError();
        const hashedPassword = await this.hasher.hash(password);
        return await this.addUserRepository.add({
            username,
            password: hashedPassword,
            name,
        });
    }
}
