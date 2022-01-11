import { DbAddUser } from "@/data/usecases";
import { UsernameInUseError } from "@/domain/errors";
import { HasherSpy, LoadUserByUsernameRepositorySpy } from "@/tests/data/mocks";
import { mockAddUserParams, throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbAddUser;
    hasherSpy: HasherSpy;
    loadUserByUsernameRepositorySpy: LoadUserByUsernameRepositorySpy;
};

const makeSut = (): SutTypes => {
    const hasherSpy = new HasherSpy();
    const loadUserByUsernameRepositorySpy =
        new LoadUserByUsernameRepositorySpy();
    const sut = new DbAddUser(hasherSpy, loadUserByUsernameRepositorySpy);

    return {
        sut,
        hasherSpy,
        loadUserByUsernameRepositorySpy,
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

    it("should call LoadUserByUsernameRepository with correct username", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        const addUserParams = mockAddUserParams();
        await sut.add(addUserParams);
        expect(loadUserByUsernameRepositorySpy.username).toBe(
            addUserParams.username,
        );
    });

    it("should return UsernameInUseError if LoadUserByUsernameRepository returns a User", async () => {
        const { sut } = makeSut();
        const result = await sut.add(mockAddUserParams());
        expect(result).toEqual(new UsernameInUseError());
    });
});
