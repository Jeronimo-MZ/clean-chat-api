import { LoadUserByToken } from "@/domain/usecases";
import { HttpResponse, Middleware } from "@/presentation/protocols";

import { unauthorized } from "../helpers";

export class AuthMiddleware
    implements Middleware<AuthMiddleware.Request, AuthMiddleware.Response>
{
    constructor(private readonly loadUserByToken: LoadUserByToken) {}
    async handle({
        accessToken,
    }: AuthMiddleware.Request): Promise<HttpResponse<AuthMiddleware.Response>> {
        if (!accessToken) return unauthorized();
        this.loadUserByToken.load({ accessToken });
        return undefined as any;
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
