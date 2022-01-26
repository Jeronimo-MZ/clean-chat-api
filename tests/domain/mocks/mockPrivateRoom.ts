import faker from "@faker-js/faker";

import { LoadPrivateRoomByIdRepository } from "@/data/protocols/database";
import { PrivateRoom } from "@/domain/models";
import {
    AddPrivateRoom,
    LoadPrivateRoomMessages,
    SendPrivateMessage,
} from "@/domain/usecases";

export const mockAddPrivateRoomInput = (): AddPrivateRoom.Input => ({
    currentUserId: faker.datatype.uuid(),
    otherUserId: faker.datatype.uuid(),
});

export const mockPrivateRoomModel = (): PrivateRoom => ({
    id: faker.datatype.uuid(),
    messages: [
        {
            content: faker.lorem.paragraph(),
            senderId: faker.datatype.uuid(),
            sentAt: new Date(),
        },
    ],
    participants: [
        {
            name: faker.name.findName(),
            username: faker.internet.userName(),
            id: faker.datatype.uuid(),
        },
        {
            name: faker.name.findName(),
            username: faker.internet.userName(),
            id: faker.datatype.uuid(),
        },
    ],
});

export class AddPrivateRoomSpy implements AddPrivateRoom {
    input: AddPrivateRoom.Input;
    output: AddPrivateRoom.Output = mockPrivateRoomModel();
    callsCount = 0;
    async add(input: AddPrivateRoom.Input): Promise<AddPrivateRoom.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export class LoadPrivateRoomByIdRepositorySpy
    implements LoadPrivateRoomByIdRepository
{
    id: string;
    output: LoadPrivateRoomByIdRepository.Output = {
        id: faker.datatype.uuid(),
        participants: [faker.datatype.uuid(), faker.datatype.uuid()],
    };
    callsCount = 0;
    async loadById(id: string): Promise<LoadPrivateRoomByIdRepository.Output> {
        this.id = id;
        this.callsCount++;
        return this.output;
    }
}

export const mockSendPrivateMessageInput = (): SendPrivateMessage.Input => ({
    senderId: faker.datatype.uuid(),
    content: faker.lorem.paragraph(),
    roomId: faker.datatype.uuid(),
});

export class SendPrivateMessageSpy implements SendPrivateMessage {
    input: SendPrivateMessage.Input;
    output: SendPrivateMessage.Output = {
        roomId: faker.datatype.uuid(),
        message: {
            content: faker.lorem.paragraph(),
            senderId: faker.datatype.uuid(),
            sentAt: new Date(),
        },
    };
    callsCount = 0;
    async send(
        input: SendPrivateMessage.Input,
    ): Promise<SendPrivateMessage.Output> {
        this.input = input;
        this.callsCount++;
        return this.output;
    }
}

export const mockLoadPrivateRoomMessagesInput =
    (): LoadPrivateRoomMessages.Input => ({
        page: faker.datatype.number(),
        pageSize: faker.datatype.number(),
        roomId: faker.datatype.uuid(),
        userId: faker.datatype.uuid(),
    });
