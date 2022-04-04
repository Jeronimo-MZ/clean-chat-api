import faker from "@faker-js/faker";

import { UsernameInUseError } from "@/domain/errors";
import { SignUpController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, forbidden, ok, serverError } from "@/presentation/helpers";
import { AddUserSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: SignUpController;
    validationSpy: ValidationSpy;
    addUserSpy: AddUserSpy;
};

const makeSut = (): SutTypes => {
    const addUserSpy = new AddUserSpy();
    const validationSpy = new ValidationSpy();
    const sut = new SignUpController(validationSpy, addUserSpy);
    return {
        sut,
        validationSpy,
        addUserSpy,
    };
};
const mockRequest = (): SignUpController.Request => {
    const password = faker.internet.password();
    return {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        password,
        passwordConfirmation: password,
    };
};

describe("SignUp Controller", () => {
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
        jest.spyOn(validationSpy, "validate").mockImplementationOnce(throwError);
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should call AddUser with correct values", async () => {
        const { sut, addUserSpy } = makeSut();

        const request = mockRequest();

        await sut.handle(request);
        expect(addUserSpy.input).toEqual({
            name: request.name,
            username: request.username,
            password: request.password,
        });
    });

    it("should not call AddUser if Validation fails", async () => {
        const { sut, validationSpy, addUserSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(addUserSpy.callsCount).toBe(0);
    });

    it("should return 500 if AddUser throws", async () => {
        const { sut, addUserSpy } = makeSut();
        jest.spyOn(addUserSpy, "add").mockImplementationOnce(throwError);
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should return 403 if AddUser returns an Error", async () => {
        const { sut, addUserSpy } = makeSut();
        addUserSpy.output = new UsernameInUseError();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(forbidden(addUserSpy.output));
    });

    it("should return 200 if valid data is provided", async () => {
        const { sut, addUserSpy } = makeSut();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(ok({ user: { ...addUserSpy.output, password: undefined } }));
    });
});
