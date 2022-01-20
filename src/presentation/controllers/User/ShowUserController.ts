import { LoadUserByToken } from "@/domain/usecases";
import { badRequest, serverError, unauthorized } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class ShowUserController
    implements Controller<ShowUserController.Request>
{
    constructor(
        private readonly validation: Validation,
        private readonly loadUserByToken: LoadUserByToken,
    ) {}
    async handle(
        request: ShowUserController.Request,
    ): Promise<HttpResponse<ShowUserController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) {
                return badRequest(error);
            }
            await this.loadUserByToken.load(request);
            return unauthorized();
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace ShowUserController {
    export type Request = {
        accessToken: string;
    };

    export type Response = {
        user: {
            id: string;
            username: string;
            name: string;
            avatar?: string;
        };
    };
}
