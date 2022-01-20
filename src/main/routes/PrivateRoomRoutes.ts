import { Router } from "express";

import { adaptMiddleware, adaptRoute } from "@/main/adapters";
import {
    makeAddPrivateRoomController,
    makeAuthMiddleware,
} from "@/main/factories";

export default (router: Router): void => {
    router.post(
        "/private_room/:otherUserId",
        adaptMiddleware(makeAuthMiddleware()),
        adaptRoute(makeAddPrivateRoomController()),
    );
};
