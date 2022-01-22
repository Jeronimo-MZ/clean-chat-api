import { SearchUsersByUsernameRepository } from "@/data/protocols/database";
import { SearchUsersByUsername } from "@/domain/usecases";

export class DbSearchUsersByUsername implements SearchUsersByUsername {
    constructor(
        private readonly searchUsersByUsernameRepository: SearchUsersByUsernameRepository,
    ) {}
    async search(
        input: SearchUsersByUsername.Input,
    ): Promise<SearchUsersByUsername.Output> {
        return await this.searchUsersByUsernameRepository.searchByUsername({
            page: input.page,
            pageSize: input.pageSize,
            username: input.username,
        });
    }
}
