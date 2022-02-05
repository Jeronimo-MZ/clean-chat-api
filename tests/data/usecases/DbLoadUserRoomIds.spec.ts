import faker from "@faker-js/faker";

import { DbLoadUserRoomIds } from "@/data/usecases";
import { LoadUserPrivateRoomIdsRepositorySpy } from "@/tests/data/mocks";

type SutTypes = {
    sut: DbLoadUserRoomIds;
    loadUserPrivateRoomIdsRepositorySpy: LoadUserPrivateRoomIdsRepositorySpy;
};

const userId = faker.datatype.uuid();

const makeSut = (): SutTypes => {
    const loadUserPrivateRoomIdsRepositorySpy =
        new LoadUserPrivateRoomIdsRepositorySpy();
    const sut = new DbLoadUserRoomIds(loadUserPrivateRoomIdsRepositorySpy);

    return {
        sut,
        loadUserPrivateRoomIdsRepositorySpy,
    };
};

describe("DbLoadUserRoomIds", () => {
    it("should call LoadUserPrivateRoomIdsRepositorySpy with correct value", async () => {
        const { sut, loadUserPrivateRoomIdsRepositorySpy } = makeSut();
        await sut.load({ userId });
        expect(loadUserPrivateRoomIdsRepositorySpy.userId).toBe(userId);
        expect(loadUserPrivateRoomIdsRepositorySpy.callsCount).toBe(1);
    });
});
