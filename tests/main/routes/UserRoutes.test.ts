import faker from "@faker-js/faker";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Collection } from "mongodb";
import request from "supertest";

import { User } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";
import { app, env, setupRoutes } from "@/main/config";

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

    describe("GET /users", () => {
        it("should return 200 on success", async () => {
            const { token } = await makeUserTokenAndId();
            const { stringToMatch } = await createUsers();

            await request(app)
                .get(
                    `/api/users?username=${stringToMatch}&pageSize=${2}&page=${2}`,
                )
                .set("x-access-token", token)
                .send()
                .expect(200);
        });
    });
});
