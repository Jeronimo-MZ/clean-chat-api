import {
    makeDbUpdateUserAvatar,
    makeUpdateUserAvatarValidation,
} from "@/main/factories";
import { UpdateUserAvatarController } from "@/presentation/controllers";

export const makeUpdateUserAvatarController =
    (): UpdateUserAvatarController => {
        return new UpdateUserAvatarController(
            makeUpdateUserAvatarValidation(),
            makeDbUpdateUserAvatar(),
        );
    };
