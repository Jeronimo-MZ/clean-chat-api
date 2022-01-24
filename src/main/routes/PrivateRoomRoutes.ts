import { Router } from "express";

import { adaptMiddleware, adaptRoute } from "@/main/adapters";
import {
    makeAddPrivateRoomController,
    makeAuthMiddleware,
    makeSendPrivateMessageController,
} from "@/main/factories";

export default (router: Router): void => {
    router.post(
        "/private_room/:otherUserId",
        adaptMiddleware(makeAuthMiddleware()),
        adaptRoute(makeAddPrivateRoomController()),
    );
    router.post(
        "/private_room/:roomId/messages",
        adaptMiddleware(makeAuthMiddleware()),
        adaptRoute(makeSendPrivateMessageController()),
    );
};
