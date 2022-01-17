import faker from "@faker-js/faker";

import { AddPrivateRoom } from "@/domain/usecases";

export const mockAddPrivateRoomInput = (): AddPrivateRoom.Input => ({
    currentUserId: faker.datatype.uuid(),
    otherUserId: faker.datatype.uuid(),
});
