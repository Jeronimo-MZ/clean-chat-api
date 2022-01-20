import { Message } from "@/domain/models";

export type PrivateRoom = {
    id: string;
    participants: [PrivateRoomUser, PrivateRoomUser];
    messages: Message[];
};

export type PrivateRoomUser = {
    id: string;
    username: string;
    name: string;
    avatar?: string;
};
