import { LoadUserByToken } from "@/domain/usecases";
import { HttpResponse, Middleware } from "@/presentation/protocols";

import { serverError, unauthorized } from "../helpers";

export class AuthMiddleware
    implements Middleware<AuthMiddleware.Request, AuthMiddleware.Response>
{
    constructor(private readonly loadUserByToken: LoadUserByToken) {}
    async handle({
        accessToken,
    }: AuthMiddleware.Request): Promise<HttpResponse<AuthMiddleware.Response>> {
        try {
            if (accessToken) await this.loadUserByToken.load({ accessToken });
            return unauthorized();
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace AuthMiddleware {
    export type Request = {
        accessToken?: string;
    };
    export type Response = {
        userId: string;
    };
}
