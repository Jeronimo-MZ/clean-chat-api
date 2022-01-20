import faker from "@faker-js/faker";

import { InvalidTokenError } from "@/domain/errors";
import { ShowUserController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError, unauthorized } from "@/presentation/helpers";
import { LoadUserByTokenSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: ShowUserController;
    validationSpy: ValidationSpy;
    loadUserByTokenSpy: LoadUserByTokenSpy;
};

const makeSut = (): SutTypes => {
    const loadUserByTokenSpy = new LoadUserByTokenSpy();
    const validationSpy = new ValidationSpy();
    const sut = new ShowUserController(validationSpy, loadUserByTokenSpy);
    return { sut, validationSpy, loadUserByTokenSpy };
};
const mockRequest = (): ShowUserController.Request => {
    return {
        accessToken: faker.random.alphaNumeric(50),
    };
};

describe("ShowUser Controller", () => {
    it("should call Validation with correct values", async () => {
        const { sut, validationSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(validationSpy.input).toEqual(request);
    });

    it("should return 400 if validation fails", async () => {
        const { sut, validationSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(badRequest(validationSpy.error));
    });

    it("should return 500 if validation throws", async () => {
        const { sut, validationSpy } = makeSut();
        jest.spyOn(validationSpy, "validate").mockImplementationOnce(
            throwError,
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should call LoadUserByToken with correct token", async () => {
        const { sut, loadUserByTokenSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(loadUserByTokenSpy.accessToken).toBe(request.accessToken);
        expect(loadUserByTokenSpy.callsCount).toBe(1);
    });

    it("should not call LoadUserByToken if Validation fails", async () => {
        const { sut, validationSpy, loadUserByTokenSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(loadUserByTokenSpy.callsCount).toBe(0);
    });

    it("should return 401 if an invalid accessToken is provided", async () => {
        const { sut, loadUserByTokenSpy } = makeSut();
        loadUserByTokenSpy.result = new InvalidTokenError();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(unauthorized());
    });

    it("should return 500 if LoadUserByToken throws", async () => {
        const { sut, loadUserByTokenSpy } = makeSut();
        jest.spyOn(loadUserByTokenSpy, "load").mockImplementationOnce(
            throwError,
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });
});
