import { UserNotFoundError } from "@/domain/errors";

export interface UpdateUserAvatar {
    update(input: UpdateUserAvatar.Input): Promise<UpdateUserAvatar.Output>;
}

export namespace UpdateUserAvatar {
    export type Input = {
        userId: string;
        file: {
            buffer: Buffer;
            mimeType: string;
        };
    };

    export type Output =
        | {
              avatarUrl: string;
          }
        | UserNotFoundError;
}
