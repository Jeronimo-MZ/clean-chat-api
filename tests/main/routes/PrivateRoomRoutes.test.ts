import faker from "@faker-js/faker";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Collection, ObjectId } from "mongodb";
import request from "supertest";

import { PrivateRoom } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";
import { app, env, setupRoutes } from "@/main/config";
import { httpApp } from "@/main/config/socket";

let usersCollection: Collection;
let privateRoomCollection: Collection;

const makeUserTokenAndId = async () => {
    const userData = {
        username: faker.internet.userName().toLowerCase(),
        name: faker.name.findName(),
        password: faker.internet.password(),
    };

    const { insertedId } = await usersCollection.insertOne({
        ...userData,
        password: await bcrypt.hash(userData.password, 12),
    });

    const token = jwt.sign({ data: insertedId.toHexString() }, env.secret, {
        expiresIn: 100,
    });
    await usersCollection.updateOne(
        { _id: insertedId },
        {
            $set: {
                accessToken: token,
            },
        },
    );
    return {
        token,
        id: insertedId.toHexString(),
    };
};

const makePrivateRoom = async (participants: [string, string]): Promise<PrivateRoom> => {
    const roomData = {
        messages: [],
        participants: participants.map(p => new ObjectId(p)),
    };
    await privateRoomCollection.insertOne(roomData);
    return MongoHelper.map(roomData);
};

describe("PrivateRoom routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
        usersCollection = await MongoHelper.getCollection(CollectionNames.USER);
        privateRoomCollection = await MongoHelper.getCollection(CollectionNames.PRIVATE_ROOM);
        setupRoutes(app);
    });
    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        await usersCollection.deleteMany({});
        await privateRoomCollection.deleteMany({});
    });

    describe("POST /api/private_room", () => {
        it("should return 200 on success", async () => {
            const user1 = await makeUserTokenAndId();
            const user2 = await makeUserTokenAndId();
            await request(app)
                .post(`/api/private_room/${user2.id}`)
                .set("x-access-token", user1.token)
                .send()
                .expect(200);
        });
    });

    describe("POST /api/private_room/:roomId/messages", () => {
        it("should return 200 on success", async () => {
            const user1 = await makeUserTokenAndId();
            const user2 = await makeUserTokenAndId();
            const privateRoom = await makePrivateRoom([user1.id, user2.id]);
            await request(httpApp)
                .post(`/api/private_room/${privateRoom.id}/messages`)
                .set("x-access-token", user1.token)
                .send({
                    content: faker.lorem.paragraph(),
                })
                .expect(200);
        });
    });

    describe("GET /api/private_room/:roomId/messages", () => {
        const makeMessages = (users: [string, string]) => [
            {
                content: faker.lorem.paragraph(),
                sentAt: faker.datatype.datetime(),
                senderId: new ObjectId(users[0]),
            },
            {
                content: faker.lorem.paragraph(),
                sentAt: faker.datatype.datetime(),
                senderId: new ObjectId(users[1]),
            },
            {
                content: faker.lorem.paragraph(),
                sentAt: faker.datatype.datetime(),
                senderId: new ObjectId(users[1]),
            },
            {
                content: faker.lorem.paragraph(),
                sentAt: faker.datatype.datetime(),
                senderId: new ObjectId(users[0]),
            },
        ];
        it("should return 200 on success", async () => {
            const user1 = await makeUserTokenAndId();
            const user2 = await makeUserTokenAndId();
            const privateRoom = await makePrivateRoom([user1.id, user2.id]);
            await privateRoomCollection.updateOne(
                { _id: new ObjectId(privateRoom.id) },
                {
                    $push: {
                        messages: { $each: makeMessages([user1.id, user2.id]) },
                    },
                },
            );
            await request(httpApp)
                .get(`/api/private_room/${privateRoom.id}/messages`)
                .set("x-access-token", user1.token)
                .send({
                    page: 1,
                    pageSize: 2,
                })
                .expect(200);
        });
    });
});
