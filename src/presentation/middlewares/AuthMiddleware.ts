import { HttpResponse, Middleware } from "@/presentation/protocols";

import { unauthorized } from "../helpers";

export class AuthMiddleware
    implements Middleware<AuthMiddleware.Request, AuthMiddleware.Response>
{
    async handle({
        accessToken,
    }: AuthMiddleware.Request): Promise<HttpResponse<AuthMiddleware.Response>> {
        if (!accessToken) return unauthorized();
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
