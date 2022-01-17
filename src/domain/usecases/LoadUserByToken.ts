import { InvalidTokenError } from "@/domain/errors";
import { User } from "@/domain/models";

export interface LoadUserByToken {
    load(input: LoadUserByToken.Input): Promise<LoadUserByToken.Output>;
}

export namespace LoadUserByToken {
    export type Input = { accessToken: string };
    export type Output = User | InvalidTokenError;
}
