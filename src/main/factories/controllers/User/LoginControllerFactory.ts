import { makeDbAuthentication } from "@/main/factories/usecases";
import { LoginController } from "@/presentation/controllers";

import { makeLoginValidation } from "./LoginValidationFactory";

export const makeLoginController = (): LoginController => {
    return new LoginController(makeLoginValidation(), makeDbAuthentication());
};
