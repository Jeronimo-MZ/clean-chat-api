import faker from "@faker-js/faker";
import { Collection } from "mongodb";
import request from "supertest";

import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";
import { app } from "@/main/config/app";
import { setupRoutes } from "@/main/config/routes";

let usersCollection: Collection;

describe("User routes", () => {
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

    describe("POST /signup", () => {
        beforeAll(() => {
            setupRoutes(app);
        });
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
});
