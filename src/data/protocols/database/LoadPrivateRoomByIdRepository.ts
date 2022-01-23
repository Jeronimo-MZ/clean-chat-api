export interface LoadPrivateRoomByIdRepository {
    loadById(id: string): Promise<LoadPrivateRoomByIdRepository.Output>;
}

export namespace LoadPrivateRoomByIdRepository {
    export type Output = {
        id: string;
        participants: [string, string];
    };
}
