import { DbAddUser } from "@/data/usecases";
import { HasherSpy } from "@/tests/data/mocks";
import { mockAddUserParams, throwError } from "@/tests/domain/mocks";

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

    it("should throw if Hasher throws", async () => {
        const { sut, hasherSpy } = makeSut();
        jest.spyOn(hasherSpy, "hash").mockImplementationOnce(throwError);
        const promise = sut.add(mockAddUserParams());
        expect(promise).rejects.toThrow();
    });
});
