import { UsernameInUseError } from "@/domain/errors";
import { User } from "@/domain/models";

export interface AddUser {
    add(data: AddUser.Input): Promise<AddUser.Output>;
}
export namespace AddUser {
    export type Input = {
        username: string;
        name: string;
        password: string;
    };

    export type Output = User | UsernameInUseError;
}
