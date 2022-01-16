import { Authentication } from "@/domain/usecases";
import { badRequest, serverError } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class LoginController
    implements Controller<LoginController.Request, LoginController.Response>
{
    constructor(
        private readonly validation: Validation,
        private readonly authentication: Authentication,
    ) {}
    async handle(
        request: LoginController.Request,
    ): Promise<HttpResponse<LoginController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);
            const { username, password } = request;
            await this.authentication.auth({ username, password });
            return undefined as any;
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace LoginController {
    export type Request = {
        username: string;
        password: string;
    };

    export type Response = {
        token: string;
    };
}
