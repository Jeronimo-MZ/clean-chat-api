import { Router } from "express";

import { adaptMiddleware, adaptRoute } from "@/main/adapters";
import {
    makeAuthMiddleware,
    makeLoginController,
    makeSearchUsersByUsernameController,
    makeShowUserController,
    makeSignUpController,
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
};
