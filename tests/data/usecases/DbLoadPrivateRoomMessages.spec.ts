import { DbLoadPrivateRoomMessages } from "@/data/usecases";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";
import {
    LoadPrivateRoomByIdRepositorySpy,
    mockLoadPrivateRoomMessagesInput,
} from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbLoadPrivateRoomMessages;
    loadPrivateRoomByIdRepositorySpy: LoadPrivateRoomByIdRepositorySpy;
    input: LoadPrivateRoomMessages.Input;
};

const makeSut = (): SutTypes => {
    const loadPrivateRoomByIdRepositorySpy =
        new LoadPrivateRoomByIdRepositorySpy();
    const input = mockLoadPrivateRoomMessagesInput();

    const sut = new DbLoadPrivateRoomMessages(loadPrivateRoomByIdRepositorySpy);

    return { sut, loadPrivateRoomByIdRepositorySpy, input };
};

describe("DbLoadPrivateRoomMessages", () => {
    it("should call LoadPrivateRoomByIdRepository with correct values", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy, input } = makeSut();
        await sut.loadMessages(input);
        expect(loadPrivateRoomByIdRepositorySpy.id).toBe(input.roomId);
        expect(loadPrivateRoomByIdRepositorySpy.callsCount).toBe(1);
    });

    it("should return RoomNotFoundError if LoadPrivateRoomByIdRepository returns null", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy, input } = makeSut();
        loadPrivateRoomByIdRepositorySpy.output = null;
        const output = await sut.loadMessages(input);
        expect(output).toEqual(new RoomNotFoundError());
    });

    it("should return UserNotInRoomError if user is not in room", async () => {
        const { sut } = makeSut();
        const output = await sut.loadMessages(
            mockLoadPrivateRoomMessagesInput(),
        );
        expect(output).toEqual(new UserNotInRoomError());
    });
});
