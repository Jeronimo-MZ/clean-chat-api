import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";
import { badRequest, serverError, unauthorized } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class LoadPrivateRoomMessagesController
    implements
        Controller<
            LoadPrivateRoomMessagesController.Request,
            LoadPrivateRoomMessagesController.Response
        >
{
    constructor(
        private readonly validation: Validation,
        private readonly loadPrivateRoomMessages: LoadPrivateRoomMessages,
    ) {}
    async handle(
        request: LoadPrivateRoomMessagesController.Request,
    ): Promise<HttpResponse<LoadPrivateRoomMessagesController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);
            const resultOrError =
                await this.loadPrivateRoomMessages.loadMessages(request);
            if (resultOrError instanceof RoomNotFoundError) {
                return badRequest(resultOrError);
            }
            if (resultOrError instanceof UserNotInRoomError) {
                return unauthorized();
            }

            return undefined as any;
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace LoadPrivateRoomMessagesController {
    export type Request = {
        userId: string;
        roomId: string;
        page: number;
        pageSize: number;
    };

    export type Response = {
        messages: {
            content: string;
            sentAt: Date;
            senderId: string;
        };
        roomId: string;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}
