import { makeDbAddUser } from "@/main/factories/usecases";
import { SignUpController } from "@/presentation/controllers";

import { makeSignUpValidation } from ".";

export const makeSignUpController = (): SignUpController => {
    return new SignUpController(makeSignUpValidation(), makeDbAddUser());
};
