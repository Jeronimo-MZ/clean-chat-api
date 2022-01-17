import { Message, User } from "@/domain/models";

export type PrivateRoom = {
    id: string;
    participants: [User, User];
    messages: Message[];
};
