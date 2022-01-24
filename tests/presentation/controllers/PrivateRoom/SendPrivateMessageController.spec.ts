import faker from "@faker-js/faker";

import { SendPrivateMessage } from "@/domain/usecases";
import { SendPrivateMessageController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError } from "@/presentation/helpers";
import { SendPrivateMessageSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: SendPrivateMessageController;
    validationSpy: ValidationSpy;
    sendPrivateMessageSpy: SendPrivateMessageSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const sendPrivateMessageSpy = new SendPrivateMessageSpy();
    const sut = new SendPrivateMessageController(
        validationSpy,
        sendPrivateMessageSpy,
    );

    return { sut, validationSpy, sendPrivateMessageSpy };
};

const mockRequest = (): SendPrivateMessageController.Request => ({
    userId: faker.datatype.uuid(),
    content: faker.lorem.paragraph(),
    roomId: faker.datatype.uuid(),
});

describe("SendPrivateMessageController", () => {
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

    it("should call SendPrivateMessage with correct value", async () => {
        const { sut, sendPrivateMessageSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(sendPrivateMessageSpy.input).toEqual<SendPrivateMessage.Input>({
            content: request.content,
            roomId: request.roomId,
            senderId: request.userId,
        });
    });

    it("should not call SendPrivateMessage if validation fails", async () => {
        const { sut, validationSpy, sendPrivateMessageSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(sendPrivateMessageSpy.callsCount).toBe(0);
    });

    it("should return 500 if SendPrivateMessage throws", async () => {
        const { sut, sendPrivateMessageSpy } = makeSut();
        jest.spyOn(sendPrivateMessageSpy, "send").mockImplementationOnce(
            throwError,
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });
});
