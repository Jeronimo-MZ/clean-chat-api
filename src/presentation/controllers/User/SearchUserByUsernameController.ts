import { SearchUsersByUsername } from "@/domain/usecases";
import { badRequest, ok, serverError } from "@/presentation/helpers";
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
            request.page = request.page ? Number(request.page) : 1;
            request.pageSize = request.pageSize ? Number(request.pageSize) : 5;
            const error = this.validation.validate(request);
            if (error) {
                return badRequest(error);
            }
            const { username, page, pageSize } = request;
            const result = await this.searchUsersByUsername.search({
                page: page,
                pageSize: pageSize,
                username,
            });
            return ok(result);
        } catch (error) {
            return serverError(error as Error);
        }
    }
}
export namespace SearchUserByUsernameController {
    export type Request = {
        username: string;
        page?: number;
        pageSize?: number;
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
