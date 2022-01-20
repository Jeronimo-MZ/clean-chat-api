import faker from "@faker-js/faker";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";

import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";
import { app, env, setupRoutes } from "@/main/config";

let usersCollection: Collection;

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

describe("User routes", () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL as string);
        setupRoutes(app);
    });
    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        usersCollection = await MongoHelper.getCollection(CollectionNames.USER);
        await usersCollection.deleteMany({});
    });

    describe("POST /signup", () => {
        it("should return 200 on success", async () => {
            const password = faker.internet.password();
            await request(app)
                .post("/api/signup")
                .send({
                    username: faker.internet.userName(),
                    name: faker.name.findName(),
                    password,
                    passwordConfirmation: password,
                })
                .expect(200);
        });
    });

    describe("POST /login", () => {
        it("should return 200 on success", async () => {
            const userData = {
                username: faker.internet.userName(),
                password: faker.internet.password(),
            };

            await usersCollection.insertOne({
                username: userData.username.toLowerCase(),
                password: await bcrypt.hash(userData.password, 12),
            });

            await request(app)
                .post("/api/login")
                .send({
                    username: userData.username,
                    password: userData.password,
                })
                .expect(200);
        });
    });

    describe("GET /users/me", () => {
        it("should return 200 on success", async () => {
            const { token } = await makeUserTokenAndId();

            await request(app)
                .get("/api/users/me")
                .set("x-access-token", token)
                .send()
                .expect(200);
        });
    });
});
