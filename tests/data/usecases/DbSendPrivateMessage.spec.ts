import { AddPrivateMessageRepository } from "@/data/protocols/database";
import { DbSendPrivateMessage } from "@/data/usecases";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import {
    LoadPrivateRoomByIdRepositorySpy,
    mockSendPrivateMessageInput,
    throwError,
} from "@/tests/domain/mocks";

import { AddPrivateMessageRepositorySpy } from "../mocks/mockDbPrivateRoom";

type SutTypes = {
    sut: DbSendPrivateMessage;
    loadPrivateRoomByIdRepositorySpy: LoadPrivateRoomByIdRepositorySpy;
    addPrivateMessageRepositorySpy: AddPrivateMessageRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadPrivateRoomByIdRepositorySpy =
        new LoadPrivateRoomByIdRepositorySpy();
    const addPrivateMessageRepositorySpy = new AddPrivateMessageRepositorySpy();
    const sut = new DbSendPrivateMessage(
        loadPrivateRoomByIdRepositorySpy,
        addPrivateMessageRepositorySpy,
    );

    return {
        sut,
        loadPrivateRoomByIdRepositorySpy,
        addPrivateMessageRepositorySpy,
    };
};

describe("DbSendPrivateMessage", () => {
    it("should call LoadPrivateRoomByIdRepository with correct values", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy } = makeSut();
        const input = mockSendPrivateMessageInput();
        await sut.send(input);
        expect(loadPrivateRoomByIdRepositorySpy.id).toBe(input.roomId);
        expect(loadPrivateRoomByIdRepositorySpy.callsCount).toBe(1);
    });

    it("should return RoomNotFoundError if LoadPrivateRoomByIdRepository returns null", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy } = makeSut();
        loadPrivateRoomByIdRepositorySpy.output = null;
        const output = await sut.send(mockSendPrivateMessageInput());
        expect(output).toEqual(new RoomNotFoundError());
    });

    it("should return UserNotInRoomError if user is not in room", async () => {
        const { sut } = makeSut();
        const output = await sut.send(mockSendPrivateMessageInput());
        expect(output).toEqual(new UserNotInRoomError());
    });

    it("should throw if LoadPrivateRoomByIdRepository throws", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy } = makeSut();
        jest.spyOn(
            loadPrivateRoomByIdRepositorySpy,
            "loadById",
        ).mockImplementationOnce(throwError);
        const promise = sut.send(mockSendPrivateMessageInput());
        expect(promise).rejects.toThrow();
    });

    it("should call AddPrivateMessageRepository with correct values", async () => {
        const { sut, addPrivateMessageRepositorySpy } = makeSut();
        const input = mockSendPrivateMessageInput();
        await sut.send(input);
        expect(
            addPrivateMessageRepositorySpy.input,
        ).toEqual<AddPrivateMessageRepository.Input>({
            roomId: input.roomId,
            message: { content: input.content, senderId: input.senderId },
        });
    });

    it("should throw if AddPrivateMessageRepository throws", async () => {
        const { sut, addPrivateMessageRepositorySpy } = makeSut();
        jest.spyOn(
            addPrivateMessageRepositorySpy,
            "addMessage",
        ).mockImplementationOnce(throwError);
        const promise = sut.send(mockSendPrivateMessageInput());
        expect(promise).rejects.toThrow();
    });
});
