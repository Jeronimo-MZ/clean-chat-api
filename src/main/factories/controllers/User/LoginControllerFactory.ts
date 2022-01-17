import { makeDbAuthentication } from "@/main/factories/usecases/User/DbAuthentication";
import { LoginController } from "@/presentation/controllers";

import { makeLoginValidation } from "./LoginValidationFactory";

export const makeLoginController = (): LoginController => {
    return new LoginController(makeLoginValidation(), makeDbAuthentication());
};
