import faker from "@faker-js/faker";

import { SearchUserByUsernameController } from "@/presentation/controllers";
import { ServerError } from "@/presentation/errors";
import { badRequest, ok, serverError } from "@/presentation/helpers";
import { SearchUsersByUsernameSpy, throwError } from "@/tests/domain/mocks";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: SearchUserByUsernameController;
    validationSpy: ValidationSpy;
    searchUsersByUsernameSpy: SearchUsersByUsernameSpy;
};

const makeSut = (): SutTypes => {
    const searchUsersByUsernameSpy = new SearchUsersByUsernameSpy();
    const validationSpy = new ValidationSpy();
    const sut = new SearchUserByUsernameController(
        validationSpy,
        searchUsersByUsernameSpy,
    );
    return { sut, validationSpy, searchUsersByUsernameSpy };
};
const mockRequest = (): SearchUserByUsernameController.Request => {
    return {
        page: faker.datatype.number({ min: 1 }),
        pageSize: faker.datatype.number({ min: 1 }),
        username: faker.internet.userName(),
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

    it("should call SearchUserByUsername with correct values", async () => {
        const { sut, searchUsersByUsernameSpy } = makeSut();
        const request = mockRequest();
        await sut.handle(request);
        expect(searchUsersByUsernameSpy.input).toEqual(request);
        expect(searchUsersByUsernameSpy.callsCount).toBe(1);
    });

    it("should not call SearchUserByUsername if validation fails", async () => {
        const { sut, validationSpy, searchUsersByUsernameSpy } = makeSut();
        validationSpy.error = new Error(faker.random.word());
        await sut.handle(mockRequest());
        expect(searchUsersByUsernameSpy.callsCount).toBe(0);
    });

    it("should return 500 if SearchUserByUsername throws", async () => {
        const { sut, searchUsersByUsernameSpy } = makeSut();
        jest.spyOn(searchUsersByUsernameSpy, "search").mockImplementationOnce(
            throwError,
        );
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(serverError(new ServerError(undefined)));
    });

    it("should return 200 on success", async () => {
        const { sut, searchUsersByUsernameSpy } = makeSut();
        const httpResponse = await sut.handle(mockRequest());
        expect(httpResponse).toEqual(ok(searchUsersByUsernameSpy.output));
    });

    it("should fill page and pageSize if they are missing", async () => {
        const { sut, searchUsersByUsernameSpy } = makeSut();
        const username = faker.internet.userName();
        await sut.handle({ username });
        expect(searchUsersByUsernameSpy.input).toEqual({
            username,
            page: 1,
            pageSize: 5,
        });
        expect(searchUsersByUsernameSpy.callsCount).toBe(1);
    });
});
