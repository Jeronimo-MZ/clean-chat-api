import { Server } from "socket.io";

import {
    makeDbSendPrivateMessage,
    makeSendPrivateMessageValidation,
} from "@/main/factories";
import { SendPrivateMessageController } from "@/presentation/controllers";

export const makeSendPrivateMessageController = (
    io: Server,
): SendPrivateMessageController => {
    return new SendPrivateMessageController(
        makeSendPrivateMessageValidation(),
        makeDbSendPrivateMessage(io),
    );
};
