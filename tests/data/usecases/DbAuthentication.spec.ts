import { DbAuthentication } from "@/data/usecases";
import { InvalidCredentialsError } from "@/domain/errors";
import {
    EncrypterSpy,
    HashComparerSpy,
    LoadUserByUsernameRepositorySpy,
} from "@/tests/data/mocks";
import {
    mockAuthenticationInput,
    mockUserModel,
    throwError,
} from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbAuthentication;
    loadUserByUsernameRepositorySpy: LoadUserByUsernameRepositorySpy;
    hashComparerSpy: HashComparerSpy;
    encrypterSpy: EncrypterSpy;
};

const makeSut = (): SutTypes => {
    const loadUserByUsernameRepositorySpy =
        new LoadUserByUsernameRepositorySpy();
    loadUserByUsernameRepositorySpy.result = mockUserModel();
    const hashComparerSpy = new HashComparerSpy();
    const encrypterSpy = new EncrypterSpy();

    const sut = new DbAuthentication(
        loadUserByUsernameRepositorySpy,
        hashComparerSpy,
        encrypterSpy,
    );
    return {
        sut,
        loadUserByUsernameRepositorySpy,
        hashComparerSpy,
        encrypterSpy,
    };
};

describe("DbAuthentication", () => {
    it("should call LoadUserByUsernameRepository with correct username", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        const authenticationInput = mockAuthenticationInput();
        await sut.auth(authenticationInput);
        expect(loadUserByUsernameRepositorySpy.username).toBe(
            authenticationInput.username,
        );
    });

    it("should return InvalidCredentialsError if LoadUserByUsernameRepository returns null", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        loadUserByUsernameRepositorySpy.result = null;
        const output = await sut.auth(mockAuthenticationInput());
        expect(output).toEqual(new InvalidCredentialsError());
    });

    it("should throw if LoadUserByUsernameRepository throws", async () => {
        const { sut, loadUserByUsernameRepositorySpy } = makeSut();
        jest.spyOn(
            loadUserByUsernameRepositorySpy,
            "loadByUsername",
        ).mockImplementationOnce(throwError);
        const promise = sut.auth(mockAuthenticationInput());
        expect(promise).rejects.toThrow();
    });

    it("should call HashComparer with correct values", async () => {
        const { sut, hashComparerSpy, loadUserByUsernameRepositorySpy } =
            makeSut();
        const authenticationInput = mockAuthenticationInput();
        await sut.auth(authenticationInput);
        expect(hashComparerSpy.plaintext).toBe(authenticationInput.password);
        expect(hashComparerSpy.digest).toBe(
            loadUserByUsernameRepositorySpy.result?.password,
        );
    });

    it("should return InvalidCredentialsError if HashComparer returns false", async () => {
        const { sut, hashComparerSpy } = makeSut();
        hashComparerSpy.isValid = false;
        const output = await sut.auth(mockAuthenticationInput());
        expect(output).toEqual(new InvalidCredentialsError());
    });

    it("should throw if HashComparer throws", async () => {
        const { sut, hashComparerSpy } = makeSut();
        jest.spyOn(hashComparerSpy, "compare").mockImplementationOnce(
            throwError,
        );
        const promise = sut.auth(mockAuthenticationInput());
        expect(promise).rejects.toThrow();
    });

    it("should call Encrypter with correct value", async () => {
        const { sut, encrypterSpy, loadUserByUsernameRepositorySpy } =
            makeSut();
        await sut.auth(mockAuthenticationInput());
        expect(encrypterSpy.plaintext).toBe(
            loadUserByUsernameRepositorySpy.result?.id,
        );
    });

    it("should throw if Encrypter throws", async () => {
        const { sut, encrypterSpy } = makeSut();
        jest.spyOn(encrypterSpy, "encrypt").mockImplementationOnce(throwError);
        const promise = sut.auth(mockAuthenticationInput());
        expect(promise).rejects.toThrow();
    });

    it("should not call Encrypter if HashComparer returns false", async () => {
        const { sut, hashComparerSpy, encrypterSpy } = makeSut();
        hashComparerSpy.isValid = false;
        await sut.auth(mockAuthenticationInput());
        expect(encrypterSpy.callsCount).toBe(0);
    });
});
