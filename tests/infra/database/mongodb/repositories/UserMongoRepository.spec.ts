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
    });
});
