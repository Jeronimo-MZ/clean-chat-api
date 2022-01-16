import faker from "@faker-js/faker";

import { LoginController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError } from "@/presentation/helpers";
import { throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: LoginController;
    validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const sut = new LoginController(validationSpy);

    return { sut, validationSpy };
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
});