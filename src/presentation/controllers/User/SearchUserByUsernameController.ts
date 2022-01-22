import { SearchUsersByUsername } from "@/domain/usecases";
import { badRequest, serverError } from "@/presentation/helpers";
import { Controller, HttpResponse } from "@/presentation/protocols";
import { Validation } from "@/validation/protocols";

export class SearchUserByUsernameController
    implements
        Controller<
            SearchUserByUsernameController.Request,
            SearchUserByUsernameController.Response
        >
{
    constructor(
        private readonly validation: Validation,
        private readonly searchUsersByUsername: SearchUsersByUsername,
    ) {}
    async handle(
        request: SearchUserByUsernameController.Request,
    ): Promise<HttpResponse<SearchUserByUsernameController.Response>> {
        try {
            const error = this.validation.validate(request);
            if (error) {
                return badRequest(error);
            }
            await this.searchUsersByUsername.search(request);
            return undefined as any;
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
export namespace SearchUserByUsernameController {
    export type Request = {
        username: string;
        page: number;
        pageSize: number;
    };

    export type Response = {
        users: {
            id: string;
            username: string;
            name: string;
            avatar?: string;
        }[];
        page: number;
        totalPages: number;
        pageSize: number;
    };
}
