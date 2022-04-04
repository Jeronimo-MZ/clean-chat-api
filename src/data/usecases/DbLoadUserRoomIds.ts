import { LoadUserPrivateRoomIdsRepository } from "@/data/protocols/database";
import { LoadUserRoomIds } from "@/domain/usecases";

export class DbLoadUserRoomIds implements LoadUserRoomIds {
    constructor(private readonly loadUserPrivateRoomIdsRepository: LoadUserPrivateRoomIdsRepository) {}
    async load({ userId }: LoadUserRoomIds.Input): Promise<LoadUserRoomIds.Output> {
        const roomIds = await this.loadUserPrivateRoomIdsRepository.loadRoomIds(userId);
        return { roomIds };
    }
}
