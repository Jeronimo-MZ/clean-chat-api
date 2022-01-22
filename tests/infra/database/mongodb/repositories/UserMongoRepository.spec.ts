import faker from "@faker-js/faker";
import { Collection } from "mongodb";

import { SearchUsersByUsernameRepository } from "@/data/protocols/database";
import { User } from "@/domain/models";
import {
    CollectionNames,
    MongoHelper,
    UserMongoRepository,
} from "@/infra/database/mongodb";
import { mockAddUserInput } from "@/tests/domain/mocks";

const makeSut = (): UserMongoRepository => new UserMongoRepository();
let usersCollection: Collection;

const makeUser = async (username = faker.internet.userName()) => {
    const userData = {
        username: username.toLowerCase(),
        name: faker.name.findName(),
        password: faker.internet.password(),
    };

    await usersCollection.insertOne(userData);
    return MongoHelper.map(userData) as User;
};

describe("UserMongoRepository", () => {
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
            const userInput = mockAddUserInput();
            const user = await sut.add(userInput);

            expect(user).toBeTruthy();
            expect(user.id).toBeTruthy();
            expect(user.name).toBe(userInput.name);
            expect(user.username).toBe(userInput.username);
            expect(user.password).toBe(userInput.password);
            expect(user.avatar).toBeFalsy();
        });

        it("should save username in lowercase", async () => {
            const sut = makeSut();
            const userInput = mockAddUserInput();
            const user = await sut.add({
                name: userInput.name,
                password: userInput.password,
                username: userInput.username.toUpperCase(),
            });

            expect(user).toBeTruthy();
            expect(user.username).toBe(userInput.username.toLowerCase());
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
            const addUserInput = mockAddUserInput();
            const { insertedId } = await usersCollection.insertOne({
                ...addUserInput,
                username: addUserInput.username.toLowerCase(),
            });
            const user = await sut.loadByUsername(addUserInput.username);

            expect(user).toBeTruthy();
            expect(user?.id).toBe(insertedId.toHexString());
            expect(user?.name).toBe(addUserInput.name);
            expect(user?.username).toBe(addUserInput.username.toLowerCase());
            expect(user?.password).toBe(addUserInput.password);
        });
    });

    describe("updateAccessToken()", () => {
        it("should update the user accessToken on success", async () => {
            const sut = makeSut();
            const { insertedId } = await usersCollection.insertOne(
                mockAddUserInput(),
            );

            const accessToken = faker.datatype.uuid();
            await sut.updateAccessToken(insertedId.toHexString(), accessToken);
            const user = (await usersCollection.findOne({
                _id: insertedId,
            })) as unknown as User;
            expect(user).toBeTruthy();
            expect(user.accessToken).toBe(accessToken);
        });
    });

    describe("loadByToken()", () => {
        it("should return null on failure", async () => {
            const sut = makeSut();
            const user = await sut.loadByToken(faker.datatype.uuid());
            expect(user).toBeNull();
        });

        it("should return a user on success", async () => {
            const sut = makeSut();
            const addUserInput = mockAddUserInput();
            const token = faker.datatype.uuid();
            const { insertedId } = await usersCollection.insertOne({
                ...addUserInput,
                accessToken: token,
            });
            const user = await sut.loadByToken(token);

            expect(user).toBeTruthy();
            expect(user?.id).toBe(insertedId.toHexString());
            expect(user?.name).toBe(addUserInput.name);
            expect(user?.username).toBe(addUserInput.username);
            expect(user?.password).toBe(addUserInput.password);
            expect(user?.accessToken).toBe(token);
            expect(user?.avatar).toBeFalsy();
        });
    });

    describe("loadById()", () => {
        it("should return null if loadById fails", async () => {
            const sut = makeSut();
            const user = await sut.loadById(faker.datatype.string(12));
            expect(user).toBeNull();
        });

        it("should return a user on success", async () => {
            const sut = makeSut();
            const addUserInput = mockAddUserInput();
            const { insertedId } = await usersCollection.insertOne(
                addUserInput,
            );
            const user = await sut.loadById(insertedId.toHexString());
            expect(user).toBeTruthy();
            expect(user?.id).toBe(insertedId.toHexString());
            expect(user?.name).toBe(addUserInput.name);
            expect(user?.username).toBe(addUserInput.username);
            expect(user?.password).toBe(addUserInput.password);
        });
    });

    describe("searchByUsername()", () => {
        async function createUsers() {
            const stringToMatch = faker.random.alphaNumeric(20).toLowerCase();
            const users = await Promise.all([
                makeUser(`${stringToMatch}first_user`),
                makeUser(`second_%${stringToMatch}_user`),
                makeUser(`third_user${stringToMatch}`),
                makeUser(`${stringToMatch}`),
                makeUser("fifth_user"),
                makeUser("sixth_user"),
            ]);
            return { stringToMatch, users };
        }
        it("should return first page values", async () => {
            const sut = makeSut();
            const { stringToMatch, users } = await createUsers();
            const result = await sut.searchByUsername({
                page: 1,
                pageSize: 2,
                username: stringToMatch.toUpperCase(),
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<SearchUsersByUsernameRepository.Output>({
                page: 1,
                pageSize: 2,
                totalPages: 2,
                users: [
                    {
                        id: users[0].id,
                        name: users[0].name,
                        username: users[0].username,
                    },
                    {
                        id: users[1].id,
                        name: users[1].name,
                        username: users[1].username,
                    },
                ],
            });
        });

        it("should return second page values", async () => {
            const sut = makeSut();
            const { stringToMatch, users } = await createUsers();
            const result = await sut.searchByUsername({
                page: 2,
                pageSize: 2,
                username: stringToMatch.toUpperCase(),
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<SearchUsersByUsernameRepository.Output>({
                page: 2,
                pageSize: 2,
                totalPages: 2,
                users: [
                    {
                        id: users[2].id,
                        name: users[2].name,
                        username: users[2].username,
                    },
                    {
                        id: users[3].id,
                        name: users[3].name,
                        username: users[3].username,
                    },
                ],
            });
        });

        it("should return empty values", async () => {
            const sut = makeSut();
            const result = await sut.searchByUsername({
                page: 1,
                pageSize: 2,
                username: faker.random.alphaNumeric(20),
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<SearchUsersByUsernameRepository.Output>({
                page: 1,
                pageSize: 2,
                totalPages: 0,
                users: [],
            });
        });
    });
});
