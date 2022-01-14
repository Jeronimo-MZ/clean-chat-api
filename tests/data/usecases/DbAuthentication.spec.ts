import { DbAuthentication } from "@/data/usecases";
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
});
