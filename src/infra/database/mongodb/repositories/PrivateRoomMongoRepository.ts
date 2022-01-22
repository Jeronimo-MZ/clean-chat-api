import { ObjectId } from "mongodb";

import { AddPrivateRoomRepository } from "@/data/protocols/database";
import { PrivateRoom, User } from "@/domain/models";
import { CollectionNames, MongoHelper } from "@/infra/database/mongodb";

export class PrivateRoomMongoRepository implements AddPrivateRoomRepository {
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
}
