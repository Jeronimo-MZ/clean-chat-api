import { DbAddPrivateRoom } from "@/data/usecases";
import { LoadUserByIdRepositorySpy } from "@/tests/data/mocks";
import { mockAddPrivateRoomInput, throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbAddPrivateRoom;
    loadUserByIdRepositorySpy: LoadUserByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy();
    const sut = new DbAddPrivateRoom(loadUserByIdRepositorySpy);

    return { sut, loadUserByIdRepositorySpy };
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
        const addPrivateRoomInput = mockAddPrivateRoomInput();
        const promise = sut.add(addPrivateRoomInput);
        expect(promise).rejects.toThrow();
    });
});
