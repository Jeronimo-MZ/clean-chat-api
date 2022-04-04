import faker from "@faker-js/faker";

import { DbLoadUserRoomIds } from "@/data/usecases";
import { LoadUserPrivateRoomIdsRepositorySpy } from "@/tests/data/mocks";
import { throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbLoadUserRoomIds;
    loadUserPrivateRoomIdsRepositorySpy: LoadUserPrivateRoomIdsRepositorySpy;
};

const userId = faker.datatype.uuid();

const makeSut = (): SutTypes => {
    const loadUserPrivateRoomIdsRepositorySpy = new LoadUserPrivateRoomIdsRepositorySpy();
    const sut = new DbLoadUserRoomIds(loadUserPrivateRoomIdsRepositorySpy);

    return {
        sut,
        loadUserPrivateRoomIdsRepositorySpy,
    };
};

describe("DbLoadUserRoomIds", () => {
    it("should call LoadUserPrivateRoomIdsRepository with correct value", async () => {
        const { sut, loadUserPrivateRoomIdsRepositorySpy } = makeSut();
        await sut.load({ userId });
        expect(loadUserPrivateRoomIdsRepositorySpy.userId).toBe(userId);
        expect(loadUserPrivateRoomIdsRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if LoadUserPrivateRoomIdsRepository throws", async () => {
        const { sut, loadUserPrivateRoomIdsRepositorySpy } = makeSut();
        jest.spyOn(loadUserPrivateRoomIdsRepositorySpy, "loadRoomIds").mockImplementationOnce(throwError);
        const promise = sut.load({ userId });
        await expect(promise).rejects.toThrow();
    });

    it("should return correct values on success", async () => {
        const { sut, loadUserPrivateRoomIdsRepositorySpy } = makeSut();
        const { roomIds } = await sut.load({ userId });
        expect(roomIds).toEqual(loadUserPrivateRoomIdsRepositorySpy.output);
    });
});
