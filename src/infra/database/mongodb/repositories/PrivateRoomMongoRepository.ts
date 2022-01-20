import { ObjectId } from "mongodb";

import { AddPrivateRoomRepository } from "@/data/protocols/database";
import { PrivateRoom } from "@/domain/models";
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
            participants: participantsObjectIds,
        });
        if (!room) {
            await PrivateRoomCollection.insertOne({
                participants: participantsObjectIds,
                messages: [],
            });
        }
        return undefined as any;
    }
}
