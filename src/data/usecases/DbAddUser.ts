import { Hasher } from "@/data/protocols/cryptography";
import { UsernameInUseError } from "@/domain/errors";
import { User } from "@/domain/models";
import { AddUser } from "@/domain/usecases";

export class DbAddUser implements AddUser {
    constructor(private readonly hasher: Hasher) {}

    async add({
        password,
    }: AddUser.Params): Promise<User | UsernameInUseError> {
        this.hasher.hash(password);
        return new UsernameInUseError();
    }
}
