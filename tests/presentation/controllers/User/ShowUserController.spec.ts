import faker from "@faker-js/faker";

import { ShowUserController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError } from "@/presentation/helpers";
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
    });
});
