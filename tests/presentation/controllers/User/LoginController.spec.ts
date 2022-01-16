import faker from "@faker-js/faker";

import { LoginController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError } from "@/presentation/helpers";
import { AuthenticationSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: LoginController;
    validationSpy: ValidationSpy;
    authenticationSpy: AuthenticationSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const authenticationSpy = new AuthenticationSpy();
    const sut = new LoginController(validationSpy, authenticationSpy);

    return { sut, validationSpy, authenticationSpy };
};

const mockRequest = (): LoginController.Request => ({
    username: faker.internet.userName(),
    password: faker.internet.password(),
});

describe("LoginController", () => {
    it("should call Validation with correct values", async () => {
        const { sut, validationSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(validationSpy.input).toEqual(request);
    });

    it("should return 400 if Validation fails", async () => {
        const { sut, validationSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(badRequest(validationSpy.error));
    });

    it("should return 500 if Validation throws", async () => {
        const { sut, validationSpy } = makeSut();
        jest.spyOn(validationSpy, "validate").mockImplementationOnce(
            throwError,
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should call Authentication with correct values", async () => {
        const { sut, authenticationSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(authenticationSpy.input).toEqual({
            username: request.username,
            password: request.password,
        });
        expect(authenticationSpy.callsCount).toBe(1);
    });

    it("should not call Authentication if Validation fails", async () => {
        const { sut, validationSpy, authenticationSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(authenticationSpy.callsCount).toBe(0);
    });

    it("should return 500 if Authentication throws", async () => {
        const { sut, authenticationSpy } = makeSut();
        jest.spyOn(authenticationSpy, "auth").mockImplementationOnce(
            throwError,
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });
});
