export interface LoadMessagesByPrivateRoomIdRepository {
    loadMessages(
        input: LoadMessagesByPrivateRoomIdRepository.Input,
    ): Promise<LoadMessagesByPrivateRoomIdRepository.Output>;
}

export namespace LoadMessagesByPrivateRoomIdRepository {
    export type Input = {
        roomId: string;
        page: number;
        pageSize: number;
    };

    export type Output = {
        messages: {
            content: string;
            sentAt: Date;
            senderId: string;
        }[];
        page: number;
        totalPages: number;
        pageSize: number;
    };
}
