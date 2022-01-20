import faker from "@faker-js/faker";

import { AddPrivateRoomController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, serverError } from "@/presentation/helpers";
import { throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: AddPrivateRoomController;
    validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const sut = new AddPrivateRoomController(validationSpy);

    return { sut, validationSpy };
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
});