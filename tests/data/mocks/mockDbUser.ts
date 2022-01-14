import {
    AddUserRepository,
    UpdateAccessTokenRepository,
} from "@/data/protocols/database";
import { LoadUserByUsernameRepository } from "@/data/protocols/database/LoadUserByUsernameRepository";
import { User } from "@/domain/models";
import { mockUserModel } from "@/tests/domain/mocks";

export class LoadUserByUsernameRepositorySpy
    implements LoadUserByUsernameRepository
{
    username: string;
    result: User | null = null;

    async loadByUsername(username: string): Promise<User | null> {
        this.username = username;
        return this.result;
    }
}

export class AddUserRepositorySpy implements AddUserRepository {
    input: AddUserRepository.Input;
    result: User = mockUserModel();
    callsCount = 0;

    async add(input: AddUserRepository.Input): Promise<User> {
        this.input = input;
        this.callsCount++;
        return this.result;
    }
}

export class UpdateAccessTokenRepositorySpy
    implements UpdateAccessTokenRepository
{
    id: string;
    token: string;

    async updateAccessToken(id: string, token: string): Promise<void> {
        this.id = id;
        this.token = token;
    }
}
