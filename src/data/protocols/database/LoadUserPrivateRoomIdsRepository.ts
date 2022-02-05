export interface LoadUserPrivateRoomIdsRepository {
    loadRoomIds(userId: string): Promise<string[]>;
}
