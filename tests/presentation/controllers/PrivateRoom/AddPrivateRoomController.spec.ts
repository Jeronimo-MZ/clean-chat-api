import faker from "@faker-js/faker";

import { UserNotFoundError } from "@/domain/errors";
import { AddPrivateRoomController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError } from "@/presentation/helpers";
import { AddPrivateRoomSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: AddPrivateRoomController;
    validationSpy: ValidationSpy;
    addPrivateRoomSpy: AddPrivateRoomSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const addPrivateRoomSpy = new AddPrivateRoomSpy();
    const sut = new AddPrivateRoomController(validationSpy, addPrivateRoomSpy);

    return { sut, validationSpy, addPrivateRoomSpy };
};

const mockRequest = (): AddPrivateRoomController.Request => ({
    userId: faker.datatype.uuid(),
    otherUserId: faker.datatype.uuid(),
});

describe("AddPrivateRoomController", () => {
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

    it("should call AddPrivateRoom with correct values", async () => {
        const { sut, addPrivateRoomSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(addPrivateRoomSpy.input).toStrictEqual({
            currentUserId: request.userId,
            otherUserId: request.otherUserId,
        });
        expect(addPrivateRoomSpy.callsCount).toBe(1);
    });

    it("should not call AddPrivateRoom if Validation fails", async () => {
        const { sut, validationSpy, addPrivateRoomSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(addPrivateRoomSpy.callsCount).toBe(0);
    });

    it("should return 500 if AddPrivateRoom throws", async () => {
        const { sut, addPrivateRoomSpy } = makeSut();
        jest.spyOn(addPrivateRoomSpy, "add").mockImplementationOnce(throwError);
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should return 400 if AddPrivateRoom returns an Error", async () => {
        const { sut, addPrivateRoomSpy } = makeSut();
        addPrivateRoomSpy.output = new UserNotFoundError();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(badRequest(addPrivateRoomSpy.output));
    });
});
