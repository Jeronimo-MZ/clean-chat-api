import { AddUser } from "@/domain/usecases";
import {
    badRequest,
    forbidden,
    serverError,
} from "@/presentation/helpers/http";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class SignUpController
    implements Controller<SignUpController.Request, SignUpController.Response>
{
    constructor(
        private readonly validation: Validation,
        private readonly addUser: AddUser,
    ) {}
    async handle(
        request: SignUpController.Request,
    ): Promise<HttpResponse<SignUpController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);
            const { name, username, password } = request;
            const userOrError = await this.addUser.add({
                name,
                username,
                password,
            });
            if (userOrError instanceof Error) return forbidden(userOrError);

            return undefined as any;
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace SignUpController {
    export type Request = {
        username: string;
        name: string;
        password: string;
        passwordConfirmation: string;
    };

    export type Response = {
        username: string;
        name: string;
    };
}
