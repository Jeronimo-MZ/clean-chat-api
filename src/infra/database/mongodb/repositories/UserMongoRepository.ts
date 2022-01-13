import { AddUserRepository } from "@/data/protocols/database";
import { User } from "@/domain/models";

import { CollectionNames, MongoHelper } from "..";

export class UserMongoRepository implements AddUserRepository {
    async add(input: AddUserRepository.Input): Promise<User> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        input.username = input.username.toLowerCase();
        await usersCollection.insertOne(input); // propery _id added to input
        return MongoHelper.map(input);
    }
}
