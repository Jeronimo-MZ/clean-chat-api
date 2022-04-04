import { makeAddPrivateRoom, makeAddPrivateRoomValidation } from "@/main/factories";
import { AddPrivateRoomController } from "@/presentation/controllers";

export const makeAddPrivateRoomController = (): AddPrivateRoomController => {
    return new AddPrivateRoomController(makeAddPrivateRoomValidation(), makeAddPrivateRoom());
};
