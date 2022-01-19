import { AddPrivateRoomRepository } from "@/data/protocols/database";
import { PrivateRoom } from "@/domain/models";
import { mockPrivateRoomModel } from "@/tests/domain/mocks";

export class AddPrivateRoomRepositorySpy implements AddPrivateRoomRepository {
    participantsId: [string, string];
    result = mockPrivateRoomModel();
    callsCount = 0;
    async add(participantsIds: [string, string]): Promise<PrivateRoom> {
        this.participantsId = participantsIds;
        this.callsCount++;
        return this.result;
    }
}
