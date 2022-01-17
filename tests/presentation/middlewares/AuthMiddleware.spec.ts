import { unauthorized } from "@/presentation/helpers";
import { AuthMiddleware } from "@/presentation/middlewares";

type SutTypes = {
    sut: AuthMiddleware;
};

const makeSut = (): SutTypes => {
    const sut = new AuthMiddleware();
    return { sut };
};

describe("Auth Middleware", () => {
    it("should return 401 if no accessToken is provided", async () => {
        const { sut } = makeSut();
        const httpResponse = await sut.handle({});
        expect(httpResponse).toEqual(unauthorized());
    });
});
