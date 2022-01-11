import { AddUser } from "@/domain/usecases";

export const mockAddUserParams = (): AddUser.Params => ({
    name: "any_name",
    password: "any_password",
    username: "any_username",
});
