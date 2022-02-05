import faker from "@faker-js/faker";

import { ObjectIdValidatorSpy, ValidationSpy } from "@/tests/validation/mocks";
import {
    CompareFieldsValidation,
    IntegerValidation,
    MinLengthValidation,
    MinValueValidation,
    ObjectIdValidation,
    ObjectValidation,
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

    it("should return IntegerValidation", () => {
        const field = faker.database.column();
        const validations = sut.field(field).integer().build();
        expect(validations).toEqual([new IntegerValidation(field)]);
    });

    it("should return ObjectIdValidation", () => {
        const field = faker.database.column();
        const objectIdValidator = new ObjectIdValidatorSpy();
        const validations = sut
            .field(field)
            .objectId(objectIdValidator)
            .build();
        expect(validations).toEqual([
            new ObjectIdValidation(field, objectIdValidator),
        ]);
    });

    it("should return ObjectValidation", () => {
        const field = faker.database.column();
        const objectValidations = [new ValidationSpy(), new ValidationSpy()];
        const validations = sut.field(field).object(objectValidations).build();
        expect(validations).toEqual([
            new ObjectValidation(field, objectValidations),
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
            .integer()
            .build();
        expect(validations).toEqual([
            new RequiredFieldValidation(field),
            new MinLengthValidation(field, length),
            new UsernameValidation(field),
            new IntegerValidation(field),
        ]);
    });
});
