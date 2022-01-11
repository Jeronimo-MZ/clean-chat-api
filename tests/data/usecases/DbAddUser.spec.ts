import { DbAddUser } from "@/data/usecases";
import { UsernameInUseError } from "@/domain/errors";
import {
    AddUserRepositorySpy,
    HasherSpy,
    LoadUserByUsernameRepositorySpy,
} from "@/tests/data/mocks";
import {
    mockAddUserParams,
    mockUserModel,
    throwError,
} from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbAddUser;
    hasherSpy: HasherSpy;
    loadUserByUsernameRepositorySpy: LoadUserByUsernameRepositorySpy;
    addUserRepositorySpy: AddUserRepositorySpy;
};

const makeSut = (): SutTypes => {
    const hasherSpy = new HasherSpy();
    const loadUserByUsernameRepositorySpy =
        new LoadUserByUsernameRepositorySpy();
    const addUserRepositorySpy = new AddUserRepositorySpy();
    const sut = new DbAddUser(
        hasherSpy,
        loadUserByUsernameRepositorySpy,
        addUserRepositorySpy,
    );

    return {
        sut,
        hasherSpy,
        loadUserByUsernameRepositorySpy,
        addUserRepositorySpy,
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

    it("should not call Hasher and AddUserRepository if LoadUserByUsernameRepository returns a User", async () => {
        const {
            sut,
            hasherSpy,
            addUserRepositorySpy,
            loadUserByUsernameRepositorySpy,
        } = makeSut();
        loadUserByUsernameRepositorySpy.result = mockUserModel();
        await sut.add(mockAddUserParams());
        expect(hasherSpy.callsCount).toBe(0);
        expect(addUserRepositorySpy.callsCount).toBe(0);
    });

    it("should throw if LoadUserByUsernameRepository throws", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        jest.spyOn(
            loadUserByUsernameRepositorySpy,
            "loadByUsername",
        ).mockImplementationOnce(throwError);
        const promise = sut.add(mockAddUserParams());
        expect(promise).rejects.toThrow();
    });

    it("should call AddUserRepository with correct values", async () => {
        const { sut, addUserRepositorySpy, hasherSpy } = makeSut();
        const addUserParams = mockAddUserParams();
        await sut.add(addUserParams);
        expect(addUserRepositorySpy.input).toEqual({
            ...addUserParams,
            password: hasherSpy.digest,
        });
        expect(addUserRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if AddUserRepository throws", async () => {
        const { sut, addUserRepositorySpy } = makeSut();
        jest.spyOn(addUserRepositorySpy, "add").mockImplementationOnce(
            throwError,
        );
        const promise = sut.add(mockAddUserParams());
        expect(promise).rejects.toThrow();
    });
});
