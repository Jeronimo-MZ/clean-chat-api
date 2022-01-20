import { PrivateRoom } from "@/domain/models";
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
    constructor(private readonly validation: Validation) {}
    async handle(
        request: AddPrivateRoomController.Request,
    ): Promise<HttpResponse<AddPrivateRoomController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);
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