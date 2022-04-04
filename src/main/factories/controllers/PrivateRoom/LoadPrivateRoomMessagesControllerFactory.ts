import { makeDbLoadPrivateRoomMessages, makeLoadPrivateRoomMessagesValidation } from "@/main/factories";
import { LoadPrivateRoomMessagesController } from "@/presentation/controllers";

export const makeLoadPrivateRoomMessagesController = (): LoadPrivateRoomMessagesController => {
    return new LoadPrivateRoomMessagesController(
        makeLoadPrivateRoomMessagesValidation(),
        makeDbLoadPrivateRoomMessages(),
    );
};
