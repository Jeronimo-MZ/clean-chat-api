import { UserNotFoundError } from "@/domain/errors";
import { UpdateUserAvatar } from "@/domain/usecases";
import { badRequest, forbidden, ok, serverError } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class UpdateUserAvatarController
    implements Controller<UpdateUserAvatarController.Request, UpdateUserAvatarController.Response>
{
    constructor(private readonly validation: Validation, private readonly updateUserAvatar: UpdateUserAvatar) {}
    async handle(
        request: UpdateUserAvatarController.Request,
    ): Promise<HttpResponse<UpdateUserAvatarController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) return badRequest(error);
            const avatarOrError = await this.updateUserAvatar.update({
                file: {
                    buffer: request.file.buffer,
                    mimeType: request.file.mimetype,
                },
                userId: request.userId,
            });
            if (avatarOrError instanceof UserNotFoundError) return forbidden(avatarOrError);

            return ok({ avatarUrl: avatarOrError.avatarUrl });
        } catch (error) {
            return serverError(error as Error);
        }
    }
}

export namespace UpdateUserAvatarController {
    export type Request = {
        userId: string;
        file: { buffer: Buffer; mimetype: string };
    };
    export type Response = { avatarUrl: string };
}
