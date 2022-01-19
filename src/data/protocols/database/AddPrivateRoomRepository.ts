import { PrivateRoom } from "@/domain/models";

export interface AddPrivateRoomRepository {
    add(participantsIds: [string, string]): Promise<PrivateRoom>;
}
