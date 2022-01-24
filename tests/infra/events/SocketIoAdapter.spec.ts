import faker from "@faker-js/faker";
import socketIo from "socket.io";

import { EventTypes } from "@/infra/events/EventTypes";
import { SocketIoAdapter } from "@/infra/events/SocketIoAdapter";

const makeSut = () => {
    const io = new socketIo.Server();
    const emit = jest.fn();
    const to = jest.fn(() => {
        return {
            emit,
        };
    }) as any;
    io.to = to;
    const sut = new SocketIoAdapter(io);

    return { sut, emit, to };
};

describe("SocketIoAdapter", () => {
    it("should call to() with correct value", () => {
        const { sut, to } = makeSut();
        const input = {
            message: {
                content: faker.lorem.paragraph(),
                senderId: faker.datatype.uuid(),
                sentAt: new Date(),
            },
            roomId: faker.datatype.uuid(),
        };
        sut.sendMessage(input);
        expect(to).toHaveBeenNthCalledWith(1, input.roomId);
    });

    it("should call emit() with correct value", () => {
        const { sut, emit } = makeSut();
        const input = {
            message: {
                content: faker.lorem.paragraph(),
                senderId: faker.datatype.uuid(),
                sentAt: new Date(),
            },
            roomId: faker.datatype.uuid(),
        };
        sut.sendMessage(input);
        expect(emit).toHaveBeenNthCalledWith(
            1,
            EventTypes.NEW_MESSAGE,
            input.message,
        );
    });
});
