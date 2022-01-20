import { UserNotFoundError } from "@/domain/errors";
import { PrivateRoom } from "@/domain/models";
import { AddPrivateRoom } from "@/domain/usecases";
import { badRequest, serverError } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class AddPrivateRoomController
    implements
        Controller<
            AddPrivateRoomController.Request,
            AddPrivateRoomController.Response
        >
{
    constructor(
        private readonly validation: Validation,
        private readonly addPrivateRoom: AddPrivateRoom,
    ) {}
    async handle(
        request: AddPrivateRoomController.Request,
    ): Promise<HttpResponse<AddPrivateRoomController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);
            const privateRoomOrError = await this.addPrivateRoom.add({
                currentUserId: request.userId,
                otherUserId: request.otherUserId,
            });

            if (privateRoomOrError instanceof UserNotFoundError)
                return badRequest(privateRoomOrError);
            return undefined as any;
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace AddPrivateRoomController {
    export type Request = {
        userId: string;
        otherUserId: string;
    };

    export type Response = PrivateRoom;
}
