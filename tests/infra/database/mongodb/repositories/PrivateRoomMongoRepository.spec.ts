import faker from "@faker-js/faker";
import { Collection, ObjectId } from "mongodb";

import { PrivateRoom, PrivateRoomUser } from "@/domain/models";
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
    users: PrivateRoomUser[];
};

const makeSut = async (): Promise<SutTypes> => {
    const users = [await makeUser(), await makeUser()];
    const sut = new PrivateRoomMongoRepository();
    return { sut, users };
};

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

    it("should add a new PrivateRoom if it doesn't exist", async () => {
        const { sut, users } = await makeSut();
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
        const { sut, users } = await makeSut();
        await makePrivateRoom(users as [PrivateRoomUser, PrivateRoomUser]);
        expect(await privateRoomCollection.countDocuments()).toBe(1);
        await sut.add([users[1].id, users[0].id]);
        expect(await privateRoomCollection.countDocuments()).toBe(1);
    });

    it("should return a PrivateRoom on success", async () => {
        const { sut, users } = await makeSut();
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
