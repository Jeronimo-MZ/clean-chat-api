import { makeDbSearchUsersByUsername } from "@/main/factories";
import { SearchUserByUsernameController } from "@/presentation/controllers";

import { makeSearchUsersByUsernameValidation } from "./SearchUsersByUsernameValidationFactory";

export const makeSearchUsersByUsernameController =
    (): SearchUserByUsernameController => {
        return new SearchUserByUsernameController(
            makeSearchUsersByUsernameValidation(),
            makeDbSearchUsersByUsername(),
        );
    };
