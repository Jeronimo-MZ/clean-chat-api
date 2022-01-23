import faker from "@faker-js/faker";

import {
    AddPrivateMessageRepository,
    AddPrivateRoomRepository,
} from "@/data/protocols/database";
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

export class AddPrivateMessageRepositorySpy
    implements AddPrivateMessageRepository
{
    input: AddPrivateMessageRepository.Input;
    output: AddPrivateMessageRepository.Output = {
        message: {
            content: faker.lorem.paragraph(),
            senderId: faker.datatype.uuid(),
            sentAt: new Date(),
        },
    };
    callsCount = 0;
    async addMessage(
        input: AddPrivateMessageRepository.Input,
    ): Promise<AddPrivateMessageRepository.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}
