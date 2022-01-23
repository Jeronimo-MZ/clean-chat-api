import { AddPrivateMessageRepository } from "@/data/protocols/database";
import { SendMessage } from "@/data/protocols/event";
import { DbSendPrivateMessage } from "@/data/usecases";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { SendPrivateMessage } from "@/domain/usecases";
import {
    AddPrivateMessageRepositorySpy,
    SendMessageMock,
} from "@/tests/data/mocks/mockDbPrivateRoom";
import {
    LoadPrivateRoomByIdRepositorySpy,
    mockSendPrivateMessageInput,
    throwError,
} from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbSendPrivateMessage;
    loadPrivateRoomByIdRepositorySpy: LoadPrivateRoomByIdRepositorySpy;
    addPrivateMessageRepositorySpy: AddPrivateMessageRepositorySpy;
    sendMessageMock: SendMessageMock;
    input: SendPrivateMessage.Input;
};

const makeSut = (): SutTypes => {
    const loadPrivateRoomByIdRepositorySpy =
        new LoadPrivateRoomByIdRepositorySpy();
    const addPrivateMessageRepositorySpy = new AddPrivateMessageRepositorySpy();
    const sendMessageMock = new SendMessageMock();

    const sut = new DbSendPrivateMessage(
        loadPrivateRoomByIdRepositorySpy,
        addPrivateMessageRepositorySpy,
        sendMessageMock,
    );

    const input = mockSendPrivateMessageInput();
    input.senderId = loadPrivateRoomByIdRepositorySpy.output
        ?.participants[0] as string;

    return {
        sut,
        loadPrivateRoomByIdRepositorySpy,
        addPrivateMessageRepositorySpy,
        sendMessageMock,
        input,
    };
};

describe("DbSendPrivateMessage", () => {
    it("should call LoadPrivateRoomByIdRepository with correct values", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy, input } = makeSut();
        await sut.send(input);
        expect(loadPrivateRoomByIdRepositorySpy.id).toBe(input.roomId);
        expect(loadPrivateRoomByIdRepositorySpy.callsCount).toBe(1);
    });

    it("should return RoomNotFoundError if LoadPrivateRoomByIdRepository returns null", async () => {
        const {
            sut,
            loadPrivateRoomByIdRepositorySpy,
            addPrivateMessageRepositorySpy,
            sendMessageMock,
            input,
        } = makeSut();
        loadPrivateRoomByIdRepositorySpy.output = null;
        const output = await sut.send(input);
        expect(output).toEqual(new RoomNotFoundError());
        expect(addPrivateMessageRepositorySpy.callsCount).toBe(0);
        expect(sendMessageMock.callsCount).toBe(0);
    });

    it("should return UserNotInRoomError if user is not in room", async () => {
        const { sut, addPrivateMessageRepositorySpy, sendMessageMock } =
            makeSut();
        const output = await sut.send(mockSendPrivateMessageInput());
        expect(output).toEqual(new UserNotInRoomError());
        expect(addPrivateMessageRepositorySpy.callsCount).toBe(0);
        expect(sendMessageMock.callsCount).toBe(0);
    });

    it("should throw if LoadPrivateRoomByIdRepository throws", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy, input } = makeSut();
        jest.spyOn(
            loadPrivateRoomByIdRepositorySpy,
            "loadById",
        ).mockImplementationOnce(throwError);
        const promise = sut.send(input);
        expect(promise).rejects.toThrow();
    });

    it("should call AddPrivateMessageRepository with correct values", async () => {
        const { sut, addPrivateMessageRepositorySpy, input } = makeSut();

        await sut.send(input);
        expect(
            addPrivateMessageRepositorySpy.input,
        ).toEqual<AddPrivateMessageRepository.Input>({
            roomId: input.roomId,
            message: { content: input.content, senderId: input.senderId },
        });
    });

    it("should throw if AddPrivateMessageRepository throws", async () => {
        const { sut, addPrivateMessageRepositorySpy, input } = makeSut();
        jest.spyOn(
            addPrivateMessageRepositorySpy,
            "addMessage",
        ).mockImplementationOnce(throwError);
        const promise = sut.send(input);
        expect(promise).rejects.toThrow();
    });

    it("should call SendMessage with correct values", async () => {
        const { sut, sendMessageMock, addPrivateMessageRepositorySpy, input } =
            makeSut();

        await sut.send(input);
        expect(sendMessageMock.input).toEqual<SendMessage.Input>({
            message: addPrivateMessageRepositorySpy.output.message,
            roomId: input.roomId,
        });
        expect(sendMessageMock.callsCount).toBe(1);
    });

    it("should return message and roomId on success", async () => {
        const { sut, input, addPrivateMessageRepositorySpy } = makeSut();
        const message = await sut.send(input);
        expect(message).toEqual({
            roomId: input.roomId,
            message: addPrivateMessageRepositorySpy.output.message,
        });
    });
});
