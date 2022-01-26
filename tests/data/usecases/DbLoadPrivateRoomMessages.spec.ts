import { LoadMessagesByPrivateRoomIdRepository } from "@/data/protocols/database";
import { DbLoadPrivateRoomMessages } from "@/data/usecases";
import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessages } from "@/domain/usecases";
import {
    LoadPrivateRoomByIdRepositorySpy,
    mockLoadPrivateRoomMessagesInput,
    throwError,
} from "@/tests/domain/mocks";

import { LoadMessagesByPrivateRoomIdRepositorySpy } from "../mocks/mockDbPrivateRoom";

type SutTypes = {
    sut: DbLoadPrivateRoomMessages;
    loadPrivateRoomByIdRepositorySpy: LoadPrivateRoomByIdRepositorySpy;
    input: LoadPrivateRoomMessages.Input;
    loadMessagesByPrivateRoomIdRepositorySpy: LoadMessagesByPrivateRoomIdRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadPrivateRoomByIdRepositorySpy =
        new LoadPrivateRoomByIdRepositorySpy();
    const loadMessagesByPrivateRoomIdRepositorySpy =
        new LoadMessagesByPrivateRoomIdRepositorySpy();
    const input = mockLoadPrivateRoomMessagesInput();
    input.userId = loadPrivateRoomByIdRepositorySpy.output
        ?.participants[0] as string;

    const sut = new DbLoadPrivateRoomMessages(
        loadPrivateRoomByIdRepositorySpy,
        loadMessagesByPrivateRoomIdRepositorySpy,
    );

    return {
        sut,
        loadPrivateRoomByIdRepositorySpy,
        input,
        loadMessagesByPrivateRoomIdRepositorySpy,
    };
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

    it("should throw if LoadPrivateRoomByIdRepository throws", async () => {
        const { sut, loadPrivateRoomByIdRepositorySpy, input } = makeSut();
        jest.spyOn(
            loadPrivateRoomByIdRepositorySpy,
            "loadById",
        ).mockImplementationOnce(throwError);
        const promise = sut.loadMessages(input);
        expect(promise).rejects.toThrow();
    });

    it("should call LoadMessagesByPrivateRoomIdRepository with correct values", async () => {
        const { sut, loadMessagesByPrivateRoomIdRepositorySpy, input } =
            makeSut();
        await sut.loadMessages(input);
        expect(
            loadMessagesByPrivateRoomIdRepositorySpy.input,
        ).toEqual<LoadMessagesByPrivateRoomIdRepository.Input>({
            page: input.page,
            pageSize: input.pageSize,
            roomId: input.roomId,
        });
        expect(loadMessagesByPrivateRoomIdRepositorySpy.callsCount).toBe(1);
    });

    it("should not call LoadMessagesByPrivateRoomIdRepository if LoadPrivateRoomByIdRepository returns null", async () => {
        const {
            sut,
            loadPrivateRoomByIdRepositorySpy,
            loadMessagesByPrivateRoomIdRepositorySpy,
            input,
        } = makeSut();
        loadPrivateRoomByIdRepositorySpy.output = null;
        await sut.loadMessages(input);
        expect(loadMessagesByPrivateRoomIdRepositorySpy.callsCount).toBe(0);
    });

    it("should not call LoadMessagesByPrivateRoomIdRepository if user is not in room", async () => {
        const { sut, loadMessagesByPrivateRoomIdRepositorySpy } = makeSut();
        await sut.loadMessages(mockLoadPrivateRoomMessagesInput());
        expect(loadMessagesByPrivateRoomIdRepositorySpy.callsCount).toBe(0);
    });

    it("should throw if LoadMessagesByPrivateRoomIdRepository throws", async () => {
        const { sut, loadMessagesByPrivateRoomIdRepositorySpy, input } =
            makeSut();
        jest.spyOn(
            loadMessagesByPrivateRoomIdRepositorySpy,
            "loadMessages",
        ).mockImplementationOnce(throwError);
        const promise = sut.loadMessages(input);
        expect(promise).rejects.toThrow();
    });
});
