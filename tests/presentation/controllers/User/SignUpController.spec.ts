import faker from "@faker-js/faker";

import { SignUpController } from "@/presentation/controllers";
import { badRequest } from "@/presentation/helpers/http";
import { ValidationSpy } from "@/tests/validation/mocks";

type SutTypes = {
    sut: SignUpController;
    validationSpy: ValidationSpy;
};

const makeSut = (): SutTypes => {
    const validationSpy = new ValidationSpy();
    const sut = new SignUpController(validationSpy);
    return {
        sut,
        validationSpy,
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
});
