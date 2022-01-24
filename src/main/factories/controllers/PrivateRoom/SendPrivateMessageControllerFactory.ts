import {
    makeDbSendPrivateMessage,
    makeSendPrivateMessageValidation,
} from "@/main/factories";
import { SendPrivateMessageController } from "@/presentation/controllers";

export const makeSendPrivateMessageController =
    (): SendPrivateMessageController => {
        return new SendPrivateMessageController(
            makeSendPrivateMessageValidation(),
            makeDbSendPrivateMessage(),
        );
    };
