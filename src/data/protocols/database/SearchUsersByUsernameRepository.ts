export interface SearchUsersByUsernameRepository {
    searchByUsername(input: SearchUsersByUsernameRepository.Input): Promise<SearchUsersByUsernameRepository.Output>;
}

export namespace SearchUsersByUsernameRepository {
    export type Input = {
        username: string;
        page: number;
        pageSize: number;
    };

    export type Output = {
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
