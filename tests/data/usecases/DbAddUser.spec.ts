import { DbAddUser } from "@/data/usecases";
import { HasherSpy } from "@/tests/data/mocks";
import { mockAddUserParams } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbAddUser;
    hasherSpy: HasherSpy;
};

const makeSut = (): SutTypes => {
    const hasherSpy = new HasherSpy();
    const sut = new DbAddUser(hasherSpy);

    return {
        sut,
        hasherSpy,
    };
};

describe("DbAddUser", () => {
    it("should call Hasher with correct password", async () => {
        const { sut, hasherSpy } = makeSut();
        const addUserParams = mockAddUserParams();
        await sut.add(addUserParams);
        expect(hasherSpy.plaintext).toBe(addUserParams.password);
    });
});
