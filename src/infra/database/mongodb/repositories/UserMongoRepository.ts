import { ObjectId } from "mongodb";

import {
    AddUserRepository,
    LoadUserByTokenRepository,
    LoadUserByUsernameRepository,
    UpdateAccessTokenRepository,
} from "@/data/protocols/database";
import { User } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";

export class UserMongoRepository
    implements
        AddUserRepository,
        LoadUserByUsernameRepository,
        UpdateAccessTokenRepository,
        LoadUserByTokenRepository
{
    async add(input: AddUserRepository.Input): Promise<User> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        input.username = input.username.toLowerCase();
        await usersCollection.insertOne(input); // propery _id added to input
        return MongoHelper.map(input);
    }

    async loadByUsername(username: string): Promise<User | null> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        const user = await usersCollection.findOne({
            username: username.toLowerCase(),
        });
        return user ? MongoHelper.map(user) : null;
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { accessToken: token } },
        );
    }

    async loadByToken(_token: string): Promise<User | null> {
        return null;
    }
}
