import { makeDbLoadUserByToken, makeDbLoadUserRoomIds } from "@/main/factories";
import { JoinAllRoomsHandler } from "@/presentation/eventHandlers";

export const makeJoinAllRoomsHandler = (): JoinAllRoomsHandler => {
    return new JoinAllRoomsHandler(
        makeDbLoadUserByToken(),
        makeDbLoadUserRoomIds(),
    );
};
