import { InvalidCredentialsError } from "../errors";

export interface Authentication {
    auth(input: Authentication.Input): Promise<Authentication.Output>;
}

export namespace Authentication {
    export type Input = {
        username: string;
        password: string;
    };
    export type Output = { token: string } | InvalidCredentialsError;
}
