import { AddUserRepository } from "@/data/protocols/database";
import { User } from "@/domain/models";

import { CollectionNames, MongoHelper } from "..";

export class UserMongoRepository implements AddUserRepository {
    async add(input: AddUserRepository.Input): Promise<User> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        await usersCollection.insertOne(input);
        return MongoHelper.map(input);
    }
}
