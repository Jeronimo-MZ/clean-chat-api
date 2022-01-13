import faker from "@faker-js/faker";

import { SignUpController } from "@/presentation/controllers";
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
});
