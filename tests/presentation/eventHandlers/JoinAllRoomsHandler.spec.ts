import faker from "@faker-js/faker";
import { Socket } from "socket.io";

import { InvalidTokenError } from "@/domain/errors";
import { User } from "@/domain/models";
import { JoinAllRoomsHandler } from "@/presentation/eventHandlers";
import { LoadUserByTokenSpy, LoadUserRoomIdsSpy } from "@/tests/domain/mocks";

jest.mock("socket.io");

type SutTypes = {
    sut: JoinAllRoomsHandler;
    socket: jest.Mocked<Socket>;
    loadUserByTokenSpy: LoadUserByTokenSpy;
    loadUserRoomIdsSpy: LoadUserRoomIdsSpy;
};

const makeSut = (): SutTypes => {
    const loadUserByTokenSpy = new LoadUserByTokenSpy();
    const loadUserRoomIdsSpy = new LoadUserRoomIdsSpy();
    const sut = new JoinAllRoomsHandler(loadUserByTokenSpy, loadUserRoomIdsSpy);
    const socket = new Socket(
        undefined as any,
        undefined as any,
        undefined as any,
    ) as jest.Mocked<Socket>;
    return { sut, socket, loadUserByTokenSpy, loadUserRoomIdsSpy };
};

const mockData = (): JoinAllRoomsHandler.Data => ({
    accessToken: faker.datatype.uuid(),
});

describe("JoinAllRoomsHandler", () => {
    it("should call LoadUserByToken with correct value", async () => {
        const { sut, socket, loadUserByTokenSpy } = makeSut();
        const data = mockData();
        await sut.handle(socket, data);
        expect(loadUserByTokenSpy.accessToken).toEqual(data.accessToken);
    });

    it("should call socket.emit with error if LoadUserByToken returns InvalidTokenError", async () => {
        const { sut, socket, loadUserByTokenSpy } = makeSut();
        loadUserByTokenSpy.result = new InvalidTokenError();
        await sut.handle(socket, mockData());
        const error = new InvalidTokenError();
        delete error.stack;
        expect(socket.emit).toHaveBeenCalledWith("client_error", error);
    });

    it("should call LoadUserRoomIds with correct value", async () => {
        const { sut, socket, loadUserByTokenSpy, loadUserRoomIdsSpy } =
            makeSut();
        await sut.handle(socket, mockData());
        expect(loadUserRoomIdsSpy.input).toEqual({
            userId: (loadUserByTokenSpy.result as User).id,
        });
    });

    it("should emit server error if LoadUserRoomIds throws", async () => {
        const { sut, socket, loadUserRoomIdsSpy } = makeSut();
        jest.spyOn(loadUserRoomIdsSpy, "load").mockRejectedValueOnce(
            new Error(),
        );
        await sut.handle(socket, mockData());
        expect(socket.emit).toHaveBeenCalledWith("server_error", new Error());
    });
});
