import { DbAddPrivateRoom } from "@/data/usecases";
import { UserNotFoundError } from "@/domain/errors";
import { LoadUserByIdRepositorySpy } from "@/tests/data/mocks";
import { mockAddPrivateRoomInput, throwError } from "@/tests/domain/mocks";

import { AddPrivateRoomRepositorySpy } from "../mocks/mockDbPrivateRoom";

type SutTypes = {
    sut: DbAddPrivateRoom;
    loadUserByIdRepositorySpy: LoadUserByIdRepositorySpy;
    addPrivateRoomRepositorySpy: AddPrivateRoomRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy();
    const addPrivateRoomRepositorySpy = new AddPrivateRoomRepositorySpy();
    const sut = new DbAddPrivateRoom(
        loadUserByIdRepositorySpy,
        addPrivateRoomRepositorySpy,
    );

    return { sut, loadUserByIdRepositorySpy, addPrivateRoomRepositorySpy };
};

describe("DbAddPrivateRoom", () => {
    it("should call LoadUserByIdRepository with correct id", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        const addPrivateRoomInput = mockAddPrivateRoomInput();
        await sut.add(addPrivateRoomInput);
        expect(loadUserByIdRepositorySpy.id).toBe(
            addPrivateRoomInput.otherUserId,
        );
        expect(loadUserByIdRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if LoadUserByIdRepository throws", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        jest.spyOn(
            loadUserByIdRepositorySpy,
            "loadById",
        ).mockImplementationOnce(throwError);
        const promise = sut.add(mockAddPrivateRoomInput());
        expect(promise).rejects.toThrow();
    });

    it("should return an Error if LoadUserByIdRepository returns null", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        loadUserByIdRepositorySpy.result = null;
        const serviceProvided = await sut.add(mockAddPrivateRoomInput());
        expect(serviceProvided).toEqual(new UserNotFoundError());
    });

    it("should call AddPrivateRoomRepository with correct values", async () => {
        const { sut, addPrivateRoomRepositorySpy } = makeSut();
        const addPrivateRoomInput = mockAddPrivateRoomInput();
        await sut.add(addPrivateRoomInput);
        expect(addPrivateRoomRepositorySpy.participantsId).toEqual([
            addPrivateRoomInput.currentUserId,
            addPrivateRoomInput.otherUserId,
        ]);
        expect(addPrivateRoomRepositorySpy.callsCount).toBe(1);
    });

    it("should not call AddPrivateRoomRepository if LoadUserByIdRepository returns null", async () => {
        const { sut, loadUserByIdRepositorySpy, addPrivateRoomRepositorySpy } =
            makeSut();
        loadUserByIdRepositorySpy.result = null;
        await sut.add(mockAddPrivateRoomInput());
        expect(addPrivateRoomRepositorySpy.callsCount).toBe(0);
    });

    it("should throw if AddPrivateRoomRepository throws", async () => {
        const { sut, addPrivateRoomRepositorySpy } = makeSut();
        jest.spyOn(addPrivateRoomRepositorySpy, "add").mockImplementationOnce(
            throwError,
        );
        const promise = sut.add(mockAddPrivateRoomInput());
        expect(promise).rejects.toThrow();
    });
});
