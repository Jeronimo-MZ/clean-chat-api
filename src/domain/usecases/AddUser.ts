import { UsernameInUseError } from "@/domain/errors";
import { User } from "@/domain/models";

export interface AddUser {
    add(data: AddUser.Params): Promise<User | UsernameInUseError>;
}
export namespace AddUser {
    export type Params = {
        username: string;
        name: string;
        password: string;
    };
}
