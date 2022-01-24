import { badRequest, serverError } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class SendPrivateMessageController
    implements
        Controller<
            SendPrivateMessageController.Request,
            SendPrivateMessageController.Response
        >
{
    constructor(private readonly validation: Validation) {}
    async handle(
        request: SendPrivateMessageController.Request,
    ): Promise<HttpResponse<SendPrivateMessageController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);

            return undefined as any;
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace SendPrivateMessageController {
    export type Request = {
        userId: string;
        roomId: string;
        content: string;
    };

    export type Response = {
        roomId: string;
        message: { content: string; sentAt: Date; senderId: string };
    };
}
