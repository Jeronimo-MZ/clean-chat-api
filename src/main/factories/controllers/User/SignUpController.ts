import { SignUpController } from "@/presentation/controllers";

import { makeDbAddUser } from "../../usecases/User/DbAddUserFactory";
import { makeSignUpValidation } from ".";

export const makeSignUpController = (): SignUpController => {
    return new SignUpController(makeSignUpValidation(), makeDbAddUser());
};
