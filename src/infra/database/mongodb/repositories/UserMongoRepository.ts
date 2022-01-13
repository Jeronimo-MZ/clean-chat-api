import {
    AddUserRepository,
    LoadUserByUsernameRepository,
} from "@/data/protocols/database";
import { User } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";

export class UserMongoRepository
    implements AddUserRepository, LoadUserByUsernameRepository
{
    async add(input: AddUserRepository.Input): Promise<User> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        input.username = input.username.toLowerCase();
        await usersCollection.insertOne(input); // propery _id added to input
        return MongoHelper.map(input);
    }

    async loadByUsername(_username: string): Promise<User | null> {
        return null;
    }
}
