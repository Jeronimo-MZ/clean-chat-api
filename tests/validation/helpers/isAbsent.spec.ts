import faker from "@faker-js/faker";

import { isAbsent as sut } from "@/validation/helpers";

describe("isAbsent", () => {
    it("should return true if null or undefined is given", async () => {
        expect(sut(undefined)).toBe(true);
        expect(sut(null)).toBe(true);
    });

    it("should return false if any valid value is given", async () => {
        expect(sut(faker.random.alphaNumeric())).toBe(false);
        expect(sut(faker.datatype.number())).toBe(false);
        expect(sut(faker.datatype.boolean())).toBe(false);
        expect(sut(0)).toBe(false);
    });
});
