export interface SendMessage {
    sendMessage(input: SendMessage.Input): void;
}

export namespace SendMessage {
    export type Input = {
        roomId: string;
        message: {
            content: string;
            sentAt: Date;
            senderId: string;
        };
    };
}
