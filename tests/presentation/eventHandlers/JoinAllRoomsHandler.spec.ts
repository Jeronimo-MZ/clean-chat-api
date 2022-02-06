import faker from "@faker-js/faker";
import { Socket } from "socket.io";

import { InvalidTokenError } from "@/domain/errors";
import { JoinAllRoomsHandler } from "@/presentation/eventHandlers";
import { LoadUserByTokenSpy } from "@/tests/domain/mocks";

jest.mock("socket.io");

type SutTypes = {
    sut: JoinAllRoomsHandler;
    socket: jest.Mocked<Socket>;
    loadUserByTokenSpy: LoadUserByTokenSpy;
};

const makeSut = (): SutTypes => {
    const loadUserByTokenSpy = new LoadUserByTokenSpy();
    const sut = new JoinAllRoomsHandler(loadUserByTokenSpy);
    const socket = new Socket(
        undefined as any,
        undefined as any,
        undefined as any,
    ) as jest.Mocked<Socket>;
    return { sut, socket, loadUserByTokenSpy };
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
        const data = mockData();
        await sut.handle(socket, data);
        const error = new InvalidTokenError();
        delete error.stack;
        expect(socket.emit).toHaveBeenCalledWith("client_error", error);
    });
});
