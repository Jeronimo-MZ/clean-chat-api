import { makeDbLoadUserByToken } from "@/main/factories";
import { ShowUserController } from "@/presentation/controllers";
import { RequiredFieldValidation } from "@/validation/validators";

export const makeShowUserController = (): ShowUserController => {
    const validation = new RequiredFieldValidation("accessToken");
    return new ShowUserController(validation, makeDbLoadUserByToken());
};
