import { DbSendPrivateMessage } from "@/data/usecases";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import {
    LoadPrivateRoomByIdRepositorySpy,
    mockSendPrivateMessageInput,
} from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbSendPrivateMessage;
    loadPrivateRoomByIdRepositorySpy: LoadPrivateRoomByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadPrivateRoomByIdRepositorySpy =
        new LoadPrivateRoomByIdRepositorySpy();
    const sut = new DbSendPrivateMessage(loadPrivateRoomByIdRepositorySpy);

    return { sut, loadPrivateRoomByIdRepositorySpy };
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
});
