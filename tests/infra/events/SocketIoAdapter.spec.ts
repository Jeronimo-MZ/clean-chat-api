import faker from "@faker-js/faker";
import socketIo from "socket.io";

import { SocketIoAdapter } from "@/infra/events/SocketIoAdapter";

const makeSut = () => {
    const io = new socketIo.Server();
    io.to = jest.fn(() => {
        return {
            emit: jest.fn(),
        };
    }) as any;
    const sut = new SocketIoAdapter(io);

    return { sut, io };
};

describe("SocketIoAdapter", () => {
    it("should call to() with correct value", () => {
        const { sut, io } = makeSut();
        const toSpy = jest.spyOn(io, "to");
        const input = {
            message: {
                content: faker.lorem.paragraph(),
                senderId: faker.datatype.uuid(),
                sentAt: new Date(),
            },
            roomId: faker.datatype.uuid(),
        };
        sut.sendMessage(input);
        expect(toSpy).toHaveBeenNthCalledWith(1, input.roomId);
    });
});
