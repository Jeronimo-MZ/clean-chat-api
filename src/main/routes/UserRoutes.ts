import { Router } from "express";

import { adaptMiddleware, adaptMulter, adaptRoute } from "@/main/adapters";
import {
    makeAuthMiddleware,
    makeLoginController,
    makeSearchUsersByUsernameController,
    makeShowUserController,
    makeSignUpController,
    makeUpdateUserAvatarController,
} from "@/main/factories";

export default (router: Router): void => {
    router.post("/signup", adaptRoute(makeSignUpController()));
    router.post("/login", adaptRoute(makeLoginController()));
    router.get("/users/me", adaptRoute(makeShowUserController()));
    router.get(
        "/users",
        adaptMiddleware(makeAuthMiddleware()),
        adaptRoute(makeSearchUsersByUsernameController()),
    );
    router.patch(
        "/users/avatar",
        adaptMulter,
        adaptMiddleware(makeAuthMiddleware()),
        adaptRoute(makeUpdateUserAvatarController()),
    );
};
