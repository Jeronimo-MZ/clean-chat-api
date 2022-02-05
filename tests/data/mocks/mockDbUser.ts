import faker from "@faker-js/faker";

import {
    AddUserRepository,
    LoadUserByIdRepository,
    LoadUserByTokenRepository,
    LoadUserByUsernameRepository,
    SearchUsersByUsernameRepository,
    UpdateAccessTokenRepository,
    UpdateUserAvatarRepository,
} from "@/data/protocols/database";
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

export class LoadUserByTokenRepositorySpy implements LoadUserByTokenRepository {
    token: string;
    result: User | null = mockUserModel();
    callsCount = 0;

    async loadByToken(token: string): Promise<User | null> {
        this.token = token;
        this.callsCount++;
        return this.result;
    }
}

export class LoadUserByIdRepositorySpy implements LoadUserByIdRepository {
    id: string;
    result: User | null = mockUserModel();
    callsCount = 0;
    async loadById(id: string): Promise<User | null> {
        this.id = id;
        this.callsCount++;
        return this.result;
    }
}

export class SearchUsersByUsernameRepositorySpy
    implements SearchUsersByUsernameRepository
{
    input: SearchUsersByUsernameRepository.Input;
    output: SearchUsersByUsernameRepository.Output = {
        page: 1,
        pageSize: 2,
        totalPages: 1,
        users: [
            {
                id: faker.datatype.uuid(),
                name: faker.name.findName(),
                username: faker.internet.userName(),
            },
            {
                id: faker.datatype.uuid(),
                name: faker.name.findName(),
                username: faker.internet.userName(),
                avatar: faker.internet.avatar(),
            },
        ],
    };
    callsCount = 0;
    async searchByUsername(
        input: SearchUsersByUsernameRepository.Input,
    ): Promise<SearchUsersByUsernameRepository.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export class UpdateUserAvatarRepositorySpy
    implements UpdateUserAvatarRepository
{
    userId: string;
    avatar: string;
    callsCount = 0;
    async updateAvatar({
        avatar,
        userId,
    }: UpdateUserAvatarRepository.Input): Promise<void> {
        this.userId = userId;
        this.callsCount++;
        this.avatar = avatar;
    }
}
