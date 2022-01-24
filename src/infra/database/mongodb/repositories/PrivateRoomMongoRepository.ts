import { ObjectId } from "mongodb";

import {
    AddPrivateMessageRepository,
    AddPrivateRoomRepository,
    LoadPrivateRoomByIdRepository,
} from "@/data/protocols/database";
import { PrivateRoom, User } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";
import { AddPrivateMessageRepositorySpy } from "@/tests/data/mocks/mockDbPrivateRoom";

export class PrivateRoomMongoRepository
    implements
        AddPrivateRoomRepository,
        LoadPrivateRoomByIdRepository,
        AddPrivateMessageRepositorySpy
{
    input: AddPrivateMessageRepository.Input;
    output: AddPrivateMessageRepository.Output;
    callsCount: number;

    async add(participantsIds: [string, string]): Promise<PrivateRoom> {
        const PrivateRoomCollection = await MongoHelper.getCollection(
            CollectionNames.PRIVATE_ROOM,
        );
        const participantsObjectIds = participantsIds.map(
            id => new ObjectId(id),
        );

        const room = await PrivateRoomCollection.findOne({
            participants: { $all: participantsObjectIds },
        });
        if (!room) {
            await PrivateRoomCollection.insertOne({
                participants: participantsObjectIds,
                messages: [],
            });
        }

        const aggregation = PrivateRoomCollection.aggregate([
            {
                $match: {
                    participants: {
                        $all: participantsObjectIds,
                    },
                },
            },
            { $limit: 1 },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participants",
                },
            },
            {
                $project: {
                    "participants.__v": 0,
                    "participants.password": 0,
                    "participants.created_at": 0,
                    "participants.accessToken": 0,
                },
            },
        ]);
        const newRoom = (await aggregation.toArray())[0] as PrivateRoom;
        newRoom.participants = newRoom.participants.map(MongoHelper.map) as [
            User,
            User,
        ];
        return MongoHelper.map(newRoom);
    }

    async loadById(id: string): Promise<LoadPrivateRoomByIdRepository.Output> {
        const privateRoomCollection = await MongoHelper.getCollection(
            CollectionNames.PRIVATE_ROOM,
        );

        const privateRoom = await privateRoomCollection.findOne({
            _id: new ObjectId(id),
        });

        return privateRoom
            ? MongoHelper.map({
                  _id: privateRoom._id,
                  participants: privateRoom.participants.map((p: any) =>
                      p.toHexString(),
                  ),
              })
            : null;
    }

    async addMessage(
        input: AddPrivateMessageRepository.Input,
    ): Promise<AddPrivateMessageRepository.Output> {
        const privateRoomCollection = await MongoHelper.getCollection(
            CollectionNames.PRIVATE_ROOM,
        );
        const message = {
            ...input.message,
            sentAt: new Date(),
        };
        await privateRoomCollection.updateOne(
            {
                _id: new ObjectId(input.roomId),
            },
            { $push: { messages: message } },
        );

        return { message };
    }
}
