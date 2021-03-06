import { CollectionNames, MongoHelper as sut } from "@/infra/database/mongodb";

describe("Mongo Helper", () => {
    beforeAll(async () => {
        await sut.connect(process.env.MONGO_URL as string);
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    it("should reconnect if mongodb client is down", async () => {
        let usersCollection = await sut.getCollection(CollectionNames.USER);
        expect(usersCollection).toBeTruthy();
        await sut.disconnect();
        usersCollection = await sut.getCollection(CollectionNames.USER);
        expect(usersCollection).toBeTruthy();
    });
});
