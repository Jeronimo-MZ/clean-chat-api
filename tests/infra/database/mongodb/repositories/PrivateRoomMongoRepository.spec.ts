import faker from "@faker-js/faker";
import mockdate from "mockdate";
import { Collection, ObjectId } from "mongodb";

import { LoadMessagesByPrivateRoomIdRepository } from "@/data/protocols/database";
import {
    PrivateRoom,
    PrivateRoomMessage,
    PrivateRoomUser,
} from "@/domain/models";
import {
    CollectionNames,
    MongoHelper,
    PrivateRoomMongoRepository,
} from "@/infra/database/mongodb";

let userCollection: Collection;
let privateRoomCollection: Collection;

const makeUser = async (): Promise<PrivateRoomUser> => {
    const userData = {
        name: faker.name.findName(),
        password: faker.internet.password(),
        username: faker.internet.userName(),
    };

    await userCollection.insertOne(userData);

    return MongoHelper.map(userData);
};

export type SutTypes = {
    sut: PrivateRoomMongoRepository;
};

const makeSut = (): SutTypes => {
    const sut = new PrivateRoomMongoRepository();
    return { sut };
};

const makeUsers = (): Promise<[PrivateRoomUser, PrivateRoomUser]> =>
    Promise.all([makeUser(), makeUser()]);

const makePrivateRoom = async (
    participants: [PrivateRoomUser, PrivateRoomUser],
): Promise<PrivateRoom> => {
    const roomData = {
        messages: [],
        participants: participants.map(p => new ObjectId(p.id)),
    };
    await privateRoomCollection.insertOne(roomData);
    return MongoHelper.map(roomData);
};

describe("PrivateRoomMongoRepository", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
        userCollection = await MongoHelper.getCollection(CollectionNames.USER);
        privateRoomCollection = await MongoHelper.getCollection(
            CollectionNames.PRIVATE_ROOM,
        );
    });
    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        await userCollection.deleteMany({});
        await privateRoomCollection.deleteMany({});
    });

    describe("add()", () => {
        it("should add a new PrivateRoom if it doesn't exist", async () => {
            const { sut } = makeSut();
            const users = await makeUsers();
            expect(await privateRoomCollection.countDocuments()).toBe(0);
            await sut.add([users[1].id, users[0].id]);
            expect(await privateRoomCollection.countDocuments()).toBe(1);
            expect(
                await privateRoomCollection.findOne({
                    participants: { $all: users.map(u => new ObjectId(u.id)) },
                }),
            ).toBeTruthy();
        });

        it("should not add a PrivateRoom if it already exists", async () => {
            const { sut } = makeSut();
            const users = await makeUsers();
            await makePrivateRoom(users);
            expect(await privateRoomCollection.countDocuments()).toBe(1);
            await sut.add([users[1].id, users[0].id]);
            expect(await privateRoomCollection.countDocuments()).toBe(1);
        });

        it("should return a PrivateRoom on success", async () => {
            const { sut } = makeSut();
            const users = await makeUsers();
            const room = await sut.add([users[1].id, users[0].id]);
            expect(room).toBeTruthy();
            expect(room.id).toBeTruthy();
            expect(room.messages).toEqual([]);
            expect(room.participants).toEqual(
                users.map(({ id, name, username }) => ({
                    id,
                    name,
                    username,
                })),
            );
        });
    });

    describe("loadById()", () => {
        it("should return null if loadById() fails", async () => {
            const { sut } = makeSut();
            const room = await sut.loadById(faker.random.alphaNumeric(12));
            expect(room).toBeNull();
        });

        it("should return a room on success", async () => {
            const { sut } = makeSut();
            const users = await makeUsers();
            const { id } = await makePrivateRoom(users);
            const room = await sut.loadById(id);
            expect(room).toBeTruthy();
            expect(room?.id).toBe(id);
            expect(room?.participants).toEqual(users.map(user => user.id));
        });
    });

    describe("addMessage()", () => {
        beforeAll(() => mockdate.set(new Date()));
        afterAll(() => mockdate.reset());
        it("should return a message on success", async () => {
            const { sut } = makeSut();
            const users = await makeUsers();
            const room = await makePrivateRoom(users);
            const input = {
                roomId: room.id,
                message: {
                    content: faker.lorem.paragraph(),
                    senderId: users[0].id,
                },
            };
            const { message } = await sut.addMessage(input);
            const updatedRoom = await privateRoomCollection.findOne({
                _id: new ObjectId(room.id),
            });
            expect(message).toBeTruthy();
            expect(message.content).toBe(input.message.content);
            expect(message.senderId).toBe(input.message.senderId);
            expect(message.sentAt).toEqual(new Date());
            expect(updatedRoom?.messages).toEqual([message]);
        });
    });

    describe("loadMessages()", () => {
        const makeMessages = (
            users: [PrivateRoomUser, PrivateRoomUser],
        ): PrivateRoomMessage[] => [
            {
                content: faker.lorem.paragraph(),
                sentAt: new Date(1002),
                senderId: users[0].id,
            },
            {
                content: faker.lorem.paragraph(),
                sentAt: new Date(1004),
                senderId: users[1].id,
            },
            {
                content: faker.lorem.paragraph(),
                sentAt: new Date(1001),
                senderId: users[1].id,
            },
            {
                content: faker.lorem.paragraph(),
                sentAt: new Date(1003),
                senderId: users[0].id,
            },
        ];
        it("should return first page values", async () => {
            const { sut } = makeSut();
            const users = [await makeUser(), await makeUser()] as [
                PrivateRoomUser,
                PrivateRoomUser,
            ];
            const room = await makePrivateRoom(users);
            const messages = makeMessages(users);
            await privateRoomCollection.updateOne(
                { _id: new ObjectId(room.id) },
                { $push: { messages: { $each: messages } } },
            );
            const result = await sut.loadMessages({
                page: 1,
                pageSize: 2,
                roomId: room.id,
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<LoadMessagesByPrivateRoomIdRepository.Output>({
                page: 1,
                pageSize: 2,
                totalPages: 2,
                messages: [messages[1], messages[3]],
            });
        });

        it("should return second page values", async () => {
            const { sut } = makeSut();
            const users = [await makeUser(), await makeUser()] as [
                PrivateRoomUser,
                PrivateRoomUser,
            ];
            const room = await makePrivateRoom(users);
            const messages = makeMessages(users);
            await privateRoomCollection.updateOne(
                { _id: new ObjectId(room.id) },
                { $push: { messages: { $each: messages } } },
            );
            const result = await sut.loadMessages({
                page: 2,
                pageSize: 2,
                roomId: room.id,
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<LoadMessagesByPrivateRoomIdRepository.Output>({
                page: 2,
                pageSize: 2,
                totalPages: 2,
                messages: [messages[0], messages[2]],
            });
        });

        it("should return empty values if room does not exist", async () => {
            const { sut } = makeSut();
            const result = await sut.loadMessages({
                page: 1,
                pageSize: 2,
                roomId: new ObjectId().toString(),
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<LoadMessagesByPrivateRoomIdRepository.Output>({
                page: 1,
                pageSize: 2,
                totalPages: 0,
                messages: [],
            });
        });

        it("should return empty values if room has no messages", async () => {
            const { sut } = makeSut();
            const users = [await makeUser(), await makeUser()] as [
                PrivateRoomUser,
                PrivateRoomUser,
            ];
            const room = await makePrivateRoom(users);
            const result = await sut.loadMessages({
                page: 1,
                pageSize: 2,
                roomId: room.id,
            });

            expect(result).toBeTruthy();
            expect(
                result,
            ).toStrictEqual<LoadMessagesByPrivateRoomIdRepository.Output>({
                page: 1,
                pageSize: 2,
                totalPages: 0,
                messages: [],
            });
        });
    });
});
