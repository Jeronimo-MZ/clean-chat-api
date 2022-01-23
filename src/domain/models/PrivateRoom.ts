export type PrivateRoom = {
    id: string;
    participants: [PrivateRoomUser, PrivateRoomUser];
    messages: PrivateRoomMessage[];
};

export type PrivateRoomUser = {
    id: string;
    username: string;
    name: string;
    avatar?: string;
};

export type PrivateRoomMessage = {
    content: string;
    sentAt: Date;
    senderId: string;
};
