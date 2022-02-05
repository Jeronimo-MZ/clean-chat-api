import faker from "@faker-js/faker";

import { User } from "@/domain/models";
import {
    AddUser,
    Authentication,
    LoadUserByToken,
    SearchUsersByUsername,
    UpdateUserAvatar,
} from "@/domain/usecases";

export const mockAddUserInput = (): AddUser.Input => ({
    name: faker.name.findName(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
});

export const mockUserModel = (): User => ({
    name: faker.name.findName(),
    password: faker.internet.password(),
    username: faker.internet.userName(),
    id: faker.datatype.uuid(),
});

export class AddUserSpy implements AddUser {
    input: AddUser.Input;
    output: AddUser.Output = mockUserModel();
    callsCount = 0;
    async add(input: AddUser.Input): Promise<AddUser.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export const mockAuthenticationInput = (): Authentication.Input => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
});

export class AuthenticationSpy implements Authentication {
    input: Authentication.Input;
    output: Authentication.Output = { token: faker.datatype.uuid() };
    callsCount = 0;
    async auth(input: Authentication.Input): Promise<Authentication.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export class LoadUserByTokenSpy implements LoadUserByToken {
    accessToken: string;
    result: LoadUserByToken.Output = mockUserModel();
    callsCount = 0;
    async load({
        accessToken,
    }: LoadUserByToken.Input): Promise<LoadUserByToken.Output> {
        this.accessToken = accessToken;
        this.callsCount++;
        return this.result;
    }
}

export const mockSearchUsersByUsernameInput =
    (): SearchUsersByUsername.Input => ({
        page: faker.datatype.number(),
        pageSize: faker.datatype.number(),
        username: faker.internet.userName(),
    });

export class SearchUsersByUsernameSpy implements SearchUsersByUsername {
    input: SearchUsersByUsername.Input;
    output: SearchUsersByUsername.Output = {
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
    async search(
        input: SearchUsersByUsername.Input,
    ): Promise<SearchUsersByUsername.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export const mockUpdateUserAvatarInput = (): UpdateUserAvatar.Input => ({
    userId: faker.datatype.uuid(),
    file: {
        buffer: Buffer.from(faker.datatype.string()),
        mimeType: "image/jpeg",
    },
});

export class UpdateUserAvatarSpy implements UpdateUserAvatar {
    file: { buffer: Buffer; mimeType: string };
    userId: string;
    output: UpdateUserAvatar.Output = {
        avatarUrl: faker.internet.url(),
    };
    callsCount = 0;
    async update({
        file,
        userId,
    }: UpdateUserAvatar.Input): Promise<UpdateUserAvatar.Output> {
        this.file = file;
        this.userId = userId;
        this.callsCount++;
        return this.output;
    }
}
