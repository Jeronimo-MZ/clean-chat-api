import faker from "@faker-js/faker";

import {
    AddPrivateMessageRepository,
    AddPrivateRoomRepository,
    LoadMessagesByPrivateRoomIdRepository,
    LoadUserPrivateRoomIdsRepository,
} from "@/data/protocols/database";
import { SendMessage } from "@/data/protocols/event";
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

export class SendMessageMock implements SendMessage {
    input: AddPrivateMessageRepository.Input;
    callsCount = 0;
    sendMessage(input: SendMessage.Input): void {
        this.input = input;
        this.callsCount++;
    }
}

export class LoadMessagesByPrivateRoomIdRepositorySpy
    implements LoadMessagesByPrivateRoomIdRepository
{
    input: LoadMessagesByPrivateRoomIdRepository.Input;
    output: LoadMessagesByPrivateRoomIdRepository.Output = {
        page: 1,
        pageSize: 2,
        totalPages: 1,
        messages: [
            {
                senderId: faker.datatype.uuid(),
                content: faker.lorem.paragraph(),
                sentAt: faker.datatype.datetime(),
            },
            {
                senderId: faker.datatype.uuid(),
                content: faker.lorem.paragraph(),
                sentAt: faker.datatype.datetime(),
            },
        ],
    };
    callsCount = 0;
    async loadMessages(
        input: LoadMessagesByPrivateRoomIdRepository.Input,
    ): Promise<LoadMessagesByPrivateRoomIdRepository.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export class LoadUserPrivateRoomIdsRepositorySpy
    implements LoadUserPrivateRoomIdsRepository
{
    userId: string;
    output: string[] = [0, 0, 0, 0].map(() => faker.datatype.uuid());
    callsCount = 0;
    async loadRoomIds(userId: string): Promise<string[]> {
        this.userId = userId;
        this.callsCount++;
        return this.output;
    }
}
