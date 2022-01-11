import { AddUserRepository } from "@/data/protocols/database";
import { LoadUserByUsernameRepository } from "@/data/protocols/database/LoadUserByUsernameRepository";
import { User } from "@/domain/models";
import { mockUserModel } from "@/tests/domain/mocks";

export class LoadUserByUsernameRepositorySpy
    implements LoadUserByUsernameRepository
{
    username: string;
    result: User | null = mockUserModel();

    async loadByUsername(username: string): Promise<User | null> {
        this.username = username;
        return this.result;
    }
}

export class AddUserRepositorySpy implements AddUserRepository {
    input: AddUserRepository.Input;
    result: User = mockUserModel();

    async add(input: AddUserRepository.Input): Promise<User> {
        this.input = input;
        return this.result;
    }
}
