import faker from "@faker-js/faker";

import { UsernameInUseError } from "@/domain/errors";
import { User } from "@/domain/models";
import { AddUser } from "@/domain/usecases";

export const mockAddUserParams = (): AddUser.Params => ({
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
    params: AddUser.Params;
    result: User | UsernameInUseError = mockUserModel();
    callsCount = 0;
    async add(params: AddUser.Params): Promise<User | UsernameInUseError> {
        this.params = params;
        this.callsCount++;
        return this.result;
    }
}
