import faker from "@faker-js/faker";

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
