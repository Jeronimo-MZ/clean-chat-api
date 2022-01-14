import { DbAuthentication } from "@/data/usecases";
import { InvalidCredentialsError } from "@/domain/errors";
import { LoadUserByUsernameRepositorySpy } from "@/tests/data/mocks";
import { mockAuthenticationInput } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbAuthentication;
    loadUserByUsernameRepositorySpy: LoadUserByUsernameRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadUserByUsernameRepositorySpy =
        new LoadUserByUsernameRepositorySpy();
    const sut = new DbAuthentication(loadUserByUsernameRepositorySpy);
    return { sut, loadUserByUsernameRepositorySpy };
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
});
