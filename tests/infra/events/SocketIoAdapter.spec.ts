import faker from "@faker-js/faker";
import socketIo from "socket.io";

import { EventTypes } from "@/infra/events/EventTypes";
import { SocketIoAdapter } from "@/infra/events/SocketIoAdapter";
import { throwError } from "@/tests/domain/mocks";

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

const makeInput = () => ({
    message: {
        content: faker.lorem.paragraph(),
        senderId: faker.datatype.uuid(),
        sentAt: new Date(),
    },
    roomId: faker.datatype.uuid(),
});

describe("SocketIoAdapter", () => {
    it("should call to() with correct value", () => {
        const { sut, to } = makeSut();
        const input = makeInput();
        sut.sendMessage(input);
        expect(to).toHaveBeenNthCalledWith(1, input.roomId);
    });

    it("should call emit() with correct value", () => {
        const { sut, emit } = makeSut();
        const input = makeInput();
        sut.sendMessage(input);
        expect(emit).toHaveBeenNthCalledWith(
            1,
            EventTypes.NEW_MESSAGE,
            input.message,
        );
    });

    it("should throw if emit() throws", () => {
        const { sut, emit } = makeSut();
        emit.mockImplementationOnce(throwError);
        expect(() => sut.sendMessage(makeInput())).toThrowError();
    });

    it("should throw if to() throws", () => {
        const { sut, to } = makeSut();
        to.mockImplementationOnce(throwError);
        expect(() => sut.sendMessage(makeInput())).toThrowError();
    });
});
