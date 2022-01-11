import { User } from "@/domain/models";
import { AddUser } from "@/domain/usecases";

export const mockAddUserParams = (): AddUser.Params => ({
    name: "any_name",
    password: "any_password",
    username: "any_username",
});

export const mockUserModel = (): User => ({
    ...mockAddUserParams(),
    id: "any_id",
});
