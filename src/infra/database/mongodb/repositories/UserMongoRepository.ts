import { ObjectId } from "mongodb";

import {
    AddUserRepository,
    LoadUserByIdRepository,
    LoadUserByTokenRepository,
    LoadUserByUsernameRepository,
    SearchUsersByUsernameRepository,
    UpdateAccessTokenRepository,
    UpdateUserAvatarRepository,
} from "@/data/protocols/database";
import { User } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";

export class UserMongoRepository
    implements
        AddUserRepository,
        LoadUserByUsernameRepository,
        LoadUserByIdRepository,
        UpdateAccessTokenRepository,
        LoadUserByTokenRepository,
        SearchUsersByUsernameRepository,
        UpdateUserAvatarRepository
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

    async loadByToken(token: string): Promise<User | null> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        const user = await usersCollection.findOne({ accessToken: token });
        return user ? MongoHelper.map(user) : null;
    }

    async loadById(id: string): Promise<User | null> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        return user ? MongoHelper.map(user) : null;
    }

    async searchByUsername({
        username,
        pageSize,
        page,
    }: SearchUsersByUsernameRepository.Input): Promise<SearchUsersByUsernameRepository.Output> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );

        const data = usersCollection.find({
            username: { $regex: new RegExp(`${username}`, "i") },
        });
        const numberOfUsers = await data.count();
        const users = await data
            .skip(page * pageSize - pageSize)
            .limit(pageSize)
            .project({ password: 0, accessToken: 0 })
            .toArray();
        return {
            page,
            pageSize,
            totalPages: Math.ceil(numberOfUsers / pageSize),
            users: users.map(MongoHelper.map),
        };
    }

    async updateAvatar({
        avatar,
        userId,
    }: UpdateUserAvatarRepository.Input): Promise<void> {
        const usersCollection = await MongoHelper.getCollection(
            CollectionNames.USER,
        );
        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { avatar } },
        );
    }
}
