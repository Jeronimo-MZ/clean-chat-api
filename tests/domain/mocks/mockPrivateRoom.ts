import faker from "@faker-js/faker";

import { PrivateRoom } from "@/domain/models";
import { AddPrivateRoom } from "@/domain/usecases";

import { mockUserModel } from ".";

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
    participants: [mockUserModel(), mockUserModel()],
});
