import { User } from "@/domain/models";

export interface AddUserRepository {
    add(input: AddUserRepository.Input): Promise<User>;
}

export namespace AddUserRepository {
    export type Input = { username: string; password: string; name: string };
}
