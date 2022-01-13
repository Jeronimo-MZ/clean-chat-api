import faker from "@faker-js/faker";

import {
    MinLengthValidation,
    RequiredFieldValidation,
    ValidationBuilder as sut,
} from "@/validation/validators";

describe("ValidationBuilder", () => {
    it("should return RequiredFieldValidation", () => {
        const field = faker.database.column();
        const validations = sut.field(field).required().build();
        expect(validations).toEqual([new RequiredFieldValidation(field)]);
    });

    it("should return MinLengthValidation", () => {
        const length = faker.datatype.number();
        const field = faker.database.column();
        const validations = sut.field(field).min(length).build();
        expect(validations).toEqual([new MinLengthValidation(field, length)]);
    });
});
