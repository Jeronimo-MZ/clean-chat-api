export interface LoadUserRoomIds {
    load(input: LoadUserRoomIds.Input): Promise<LoadUserRoomIds.Output>;
}
export namespace LoadUserRoomIds {
    export type Input = {
        userId: string;
    };

    export type Output = {
        roomIds: string[];
    };
}
