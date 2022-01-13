import faker from "@faker-js/faker";
import { Collection } from "mongodb";

import {
    CollectionNames,
    MongoHelper,
    UserMongoRepository,
} from "@/infra/database/mongodb";
import { mockAddUserParams } from "@/tests/domain/mocks";

const makeSut = (): UserMongoRepository => new UserMongoRepository();

describe("UserMongoRepository", () => {
    let usersCollection: Collection;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
    });
    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        usersCollection = await MongoHelper.getCollection(CollectionNames.USER);
        await usersCollection.deleteMany({});
    });
    describe("add()", () => {
        it("should return a user on success", async () => {
            const sut = makeSut();
            const userParams = mockAddUserParams();
            const user = await sut.add(userParams);

            expect(user).toBeTruthy();
            expect(user.id).toBeTruthy();
            expect(user.name).toBe(userParams.name);
            expect(user.username).toBe(userParams.username);
            expect(user.password).toBe(userParams.password);
            expect(user.avatar).toBeFalsy();
        });

        it("should save username in lowercase", async () => {
            const sut = makeSut();
            const userParams = mockAddUserParams();
            const user = await sut.add({
                name: userParams.name,
                password: userParams.password,
                username: userParams.username.toUpperCase(),
            });

            expect(user).toBeTruthy();
            expect(user.username).toBe(userParams.username.toLowerCase());
        });
    });

    describe("loadByUsername()", () => {
        it("should return null if loadByUsername fails", async () => {
            const sut = makeSut();
            const user = await sut.loadByUsername(faker.internet.userName());
            expect(user).toBeNull();
        });

        it("should return a user on success", async () => {
            const sut = makeSut();
            const addUserParams = mockAddUserParams();
            const { insertedId } = await usersCollection.insertOne({
                ...addUserParams,
                username: addUserParams.username.toLowerCase(),
            });
            const user = await sut.loadByUsername(addUserParams.username);

            expect(user).toBeTruthy();
            expect(user?.id).toBe(insertedId.toHexString());
            expect(user?.name).toBe(addUserParams.name);
            expect(user?.username).toBe(addUserParams.username.toLowerCase());
            expect(user?.password).toBe(addUserParams.password);
        });
    });
});
