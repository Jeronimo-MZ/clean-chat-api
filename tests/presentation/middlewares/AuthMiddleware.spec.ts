import faker from "@faker-js/faker";

import { unauthorized } from "@/presentation/helpers";
import { AuthMiddleware } from "@/presentation/middlewares";
import { LoadUserByTokenSpy } from "@/tests/domain/mocks";

type SutTypes = {
    sut: AuthMiddleware;
    loadUserByTokenSpy: LoadUserByTokenSpy;
};

const makeSut = (): SutTypes => {
    const loadUserByTokenSpy = new LoadUserByTokenSpy();
    const sut = new AuthMiddleware(loadUserByTokenSpy);
    return { sut, loadUserByTokenSpy };
};

const mockRequest = (): AuthMiddleware.Request => ({
    accessToken: faker.random.alphaNumeric(50),
});

describe("Auth Middleware", () => {
    it("should return 401 if no accessToken is provided", async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});
        expect(httpResponse).toEqual(unauthorized());
    });

    it("should call LoadUserByToken with correct accessToken", async () => {
        const { sut, loadUserByTokenSpy } = makeSut();
        const httpRequest = mockRequest();
        await sut.handle(httpRequest);
        expect(loadUserByTokenSpy.accessToken).toBe(httpRequest.accessToken);
        expect(loadUserByTokenSpy.callsCount).toBe(1);
    });

    it("should not call LoadUserByToken if no accessToken is provided", async () => {
        const { sut, loadUserByTokenSpy } = makeSut();
        await sut.handle({});
        expect(loadUserByTokenSpy.callsCount).toBe(0);
    });
});
