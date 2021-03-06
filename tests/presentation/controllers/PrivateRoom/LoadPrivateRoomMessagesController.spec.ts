import faker from "@faker-js/faker";

import { RoomNotFoundError, UserNotInRoomError } from "@/domain/errors";
import { LoadPrivateRoomMessagesController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, ok, serverError, unauthorized } from "@/presentation/helpers";
import { LoadPrivateRoomMessagesSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: LoadPrivateRoomMessagesController;
    validationSpy: ValidationSpy;
    loadPrivateRoomMessagesSpy: LoadPrivateRoomMessagesSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const loadPrivateRoomMessagesSpy = new LoadPrivateRoomMessagesSpy();
    const sut = new LoadPrivateRoomMessagesController(validationSpy, loadPrivateRoomMessagesSpy);

    return { sut, validationSpy, loadPrivateRoomMessagesSpy };
};

const mockRequest = (): LoadPrivateRoomMessagesController.Request => ({
    userId: faker.datatype.uuid(),
    page: faker.datatype.number(),
    pageSize: faker.datatype.number(),
    roomId: faker.datatype.uuid(),
});

describe("LoadPrivateRoomMessagesController", () => {
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
        jest.spyOn(validationSpy, "validate").mockImplementationOnce(throwError);
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should call LoadPrivateRoomMessages with correct value", async () => {
        const { sut, loadPrivateRoomMessagesSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(loadPrivateRoomMessagesSpy.input).toEqual(request);
        expect(loadPrivateRoomMessagesSpy.callsCount).toBe(1);
    });

    it("should not call LoadPrivateRoomMessages if validation fails", async () => {
        const { sut, validationSpy, loadPrivateRoomMessagesSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(loadPrivateRoomMessagesSpy.callsCount).toBe(0);
    });

    it("should return 500 if LoadPrivateRoomMessages throws", async () => {
        const { sut, loadPrivateRoomMessagesSpy } = makeSut();
        jest.spyOn(loadPrivateRoomMessagesSpy, "loadMessages").mockImplementationOnce(throwError);
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should return 400 if LoadPrivateRoomMessages returns RoomNotFoundError", async () => {
        const { sut, loadPrivateRoomMessagesSpy } = makeSut();
        loadPrivateRoomMessagesSpy.output = new RoomNotFoundError();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(badRequest(loadPrivateRoomMessagesSpy.output));
    });

    it("should return 401 if LoadPrivateRoomMessages returns UserNotInRoomError", async () => {
        const { sut, loadPrivateRoomMessagesSpy } = makeSut();
        loadPrivateRoomMessagesSpy.output = new UserNotInRoomError();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(unauthorized());
    });

    it("should fill page and pageSize if they are missing", async () => {
        const { sut, loadPrivateRoomMessagesSpy } = makeSut();
        const [roomId, userId] = [0, 0].map(() => faker.datatype.uuid());
        await sut.handle({ roomId, userId });
        expect(loadPrivateRoomMessagesSpy.input).toEqual({
            roomId,
            userId,
            page: 1,
            pageSize: 10,
        });
        expect(loadPrivateRoomMessagesSpy.callsCount).toBe(1);
    });

    it("should return 200 if valid data is provided", async () => {
        const { sut, loadPrivateRoomMessagesSpy } = makeSut();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(ok(loadPrivateRoomMessagesSpy.output));
    });
});
