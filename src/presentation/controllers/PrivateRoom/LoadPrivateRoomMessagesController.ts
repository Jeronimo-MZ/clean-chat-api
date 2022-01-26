import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";
import {
    badRequest,
    ok,
    serverError,
    unauthorized,
} from "@/presentation/helpers";
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
            request.page = request.page ? Number(request.page) : 1;
            request.pageSize = request.pageSize ? Number(request.pageSize) : 10;
            const error = this.validation.validate(request);
            if (error) return badRequest(error);

            const { roomId, userId, page, pageSize } = request;
            const resultOrError =
                await this.loadPrivateRoomMessages.loadMessages({
                    page,
                    pageSize,
                    roomId,
                    userId,
                });
            if (resultOrError instanceof RoomNotFoundError) {
                return badRequest(resultOrError);
            }
            if (resultOrError instanceof UserNotInRoomError) {
                return unauthorized();
            }
            return ok(resultOrError);
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace LoadPrivateRoomMessagesController {
    export type Request = {
        userId: string;
        roomId: string;
        page?: number;
        pageSize?: number;
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
