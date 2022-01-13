import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class SignUpController
    implements Controller<SignUpController.Request, SignUpController.Response>
{
    constructor(private readonly validation: Validation) {}
    async handle(
        request: SignUpController.Request,
    ): Promise<HttpResponse<SignUpController.Response>> {
        this.validation.validate(request);
        return undefined as any;
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
