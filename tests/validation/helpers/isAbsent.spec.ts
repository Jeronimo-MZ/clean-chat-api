import { isAbsent as sut } from "@/validation/helpers";

describe("isAbsent", () => {
    it("should return true if null or undefined is given", async () => {
        expect(sut(undefined)).toBe(true);
        expect(sut(null)).toBe(true);
    });
});
