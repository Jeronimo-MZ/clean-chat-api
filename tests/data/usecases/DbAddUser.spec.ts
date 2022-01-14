import { DbAddUser } from "@/data/usecases";
import { UsernameInUseError } from "@/domain/errors";
import {
    AddUserRepositorySpy,
    HasherSpy,
    LoadUserByUsernameRepositorySpy,
} from "@/tests/data/mocks";
import {
    mockAddUserInput,
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
        const addUserInput = mockAddUserInput();
        await sut.add(addUserInput);
        expect(hasherSpy.plaintext).toBe(addUserInput.password);
    });

    it("should throw if Hasher throws", async () => {
        const { sut, hasherSpy } = makeSut();
        jest.spyOn(hasherSpy, "hash").mockImplementationOnce(throwError);
        const promise = sut.add(mockAddUserInput());
        expect(promise).rejects.toThrow();
    });

    it("should call LoadUserByUsernameRepository with correct username", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        const addUserInput = mockAddUserInput();
        await sut.add(addUserInput);
        expect(loadUserByUsernameRepositorySpy.username).toBe(
            addUserInput.username,
        );
    });

    it("should return UsernameInUseError if LoadUserByUsernameRepository returns a User", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        loadUserByUsernameRepositorySpy.result = mockUserModel();
        const result = await sut.add(mockAddUserInput());
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
        await sut.add(mockAddUserInput());
        expect(hasherSpy.callsCount).toBe(0);
        expect(addUserRepositorySpy.callsCount).toBe(0);
    });

    it("should throw if LoadUserByUsernameRepository throws", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        jest.spyOn(
            loadUserByUsernameRepositorySpy,
            "loadByUsername",
        ).mockImplementationOnce(throwError);
        const promise = sut.add(mockAddUserInput());
        expect(promise).rejects.toThrow();
    });

    it("should call AddUserRepository with correct values", async () => {
        const { sut, addUserRepositorySpy, hasherSpy } = makeSut();
        const addUserInput = mockAddUserInput();
        await sut.add(addUserInput);
        expect(addUserRepositorySpy.input).toEqual({
            ...addUserInput,
            password: hasherSpy.digest,
        });
        expect(addUserRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if AddUserRepository throws", async () => {
        const { sut, addUserRepositorySpy } = makeSut();
        jest.spyOn(addUserRepositorySpy, "add").mockImplementationOnce(
            throwError,
        );
        const promise = sut.add(mockAddUserInput());
        expect(promise).rejects.toThrow();
    });

    it("should return an user on success", async () => {
        const { sut, addUserRepositorySpy } = makeSut();
        const result = await sut.add(mockAddUserInput());
        expect(result).toEqual(addUserRepositorySpy.result);
    });
});
