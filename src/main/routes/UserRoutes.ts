import { Router } from "express";

import { adaptRoute } from "@/main/adapters";
import {
    makeLoginController,
    makeShowUserController,
    makeSignUpController,
} from "@/main/factories";

export default (router: Router): void => {
    router.post("/signup", adaptRoute(makeSignUpController()));
    router.post("/login", adaptRoute(makeLoginController()));
    router.get("/users/me", adaptRoute(makeShowUserController()));
};
