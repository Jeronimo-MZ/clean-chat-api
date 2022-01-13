import faker from "@faker-js/faker";

import {
    RequiredFieldValidation,
    ValidationBuilder as sut,
} from "@/validation/validators";

describe("ValidationBuilder", () => {
    it("should return RequiredFieldValidation", () => {
        const field = faker.database.column();
        const validations = sut.field(field).required().build();
        expect(validations).toEqual([new RequiredFieldValidation(field)]);
    });
});
