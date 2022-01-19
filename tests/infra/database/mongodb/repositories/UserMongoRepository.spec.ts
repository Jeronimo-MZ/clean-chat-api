import faker from "@faker-js/faker";
import { Collection } from "mongodb";

import { User } from "@/domain/models";
import {
    CollectionNames,
    MongoHelper,
    UserMongoRepository,
} from "@/infra/database/mongodb";
import { mockAddUserInput } from "@/tests/domain/mocks";

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
});
