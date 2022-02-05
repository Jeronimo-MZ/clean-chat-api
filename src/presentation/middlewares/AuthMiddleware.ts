import { InvalidTokenError } from "@/domain/errors";
import { LoadUserByToken } from "@/domain/usecases";
import { ok, serverError, unauthorized } from "@/presentation/helpers";
import { HttpResponse, Middleware } from "@/presentation/protocols";

export class AuthMiddleware
    implements Middleware<AuthMiddleware.Request, AuthMiddleware.Response>
{
    constructor(private readonly loadUserByToken: LoadUserByToken) {}
    async handle({
        accessToken,
    }: AuthMiddleware.Request): Promise<HttpResponse<AuthMiddleware.Response>> {
        try {
            if (accessToken) {
                const userOrError = await this.loadUserByToken.load({
                    accessToken,
                });
                if (!(userOrError instanceof InvalidTokenError))
                    return ok({ userId: userOrError.id });
            }
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
