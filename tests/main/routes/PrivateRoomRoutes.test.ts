import faker from "@faker-js/faker";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";

import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";
import { app, env, setupRoutes } from "@/main/config";

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

describe("PrivateRoom routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
        usersCollection = await MongoHelper.getCollection(CollectionNames.USER);
        privateRoomCollection = await MongoHelper.getCollection(
            CollectionNames.PRIVATE_ROOM,
        );
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
});
