import faker from "@faker-js/faker";

import {
    CompareFieldsValidation,
    MinLengthValidation,
    MinValueValidation,
    RequiredFieldValidation,
    UsernameValidation,
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
        let validations = sut.field(field).min(length).build();
        expect(validations).toEqual([new MinLengthValidation(field, length)]);
        validations = sut.field(field).min(length, { isNumber: false }).build();
        expect(validations).toEqual([new MinLengthValidation(field, length)]);
    });

    it("should return MinValueValidation", () => {
        const length = faker.datatype.number();
        const field = faker.database.column();
        const validations = sut
            .field(field)
            .min(length, { isNumber: true })
            .build();
        expect(validations).toEqual([new MinValueValidation(field, length)]);
    });

    it("should return UsernameValidation", () => {
        const field = faker.database.column();
        const validations = sut.field(field).username().build();
        expect(validations).toEqual([new UsernameValidation(field)]);
    });

    it("should return CompareFieldsValidation", () => {
        const field = faker.database.column();
        const fieldToCompare = faker.database.column();
        const validations = sut.field(field).equals(fieldToCompare).build();
        expect(validations).toEqual([
            new CompareFieldsValidation(field, fieldToCompare),
        ]);
    });

    it("should return a list of validations", () => {
        const field = faker.database.column();
        const length = faker.datatype.number();
        const validations = sut
            .field(field)
            .required()
            .min(length)
            .username()
            .build();
        expect(validations).toEqual([
            new RequiredFieldValidation(field),
            new MinLengthValidation(field, length),
            new UsernameValidation(field),
        ]);
    });
});
