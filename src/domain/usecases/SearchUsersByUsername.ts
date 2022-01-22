export interface SearchUsersByUsername {
    search(
        input: SearchUsersByUsername.Input,
    ): Promise<SearchUsersByUsername.Output>;
}

export namespace SearchUsersByUsername {
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
