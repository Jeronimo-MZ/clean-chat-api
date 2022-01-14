import faker from "@faker-js/faker";

import { User } from "@/domain/models";
import { AddUser } from "@/domain/usecases";

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
