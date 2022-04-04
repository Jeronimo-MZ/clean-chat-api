import { InvalidMimeTypeError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { Validation } from "@/validation/protocols";

export type Extension = "png" | "jpg";

export class AllowedMimeTypesValidation implements Validation {
    constructor(private readonly allowed: Extension[], private readonly field: string) {}

    validate(input: any): Error | null {
        const value = input[this.field];
        if (isAbsent(value) || this.isPng(value) || this.isJpg(input[this.field])) return null;
        return new InvalidMimeTypeError(this.field, this.allowed);
    }

    private isPng(mimeType: string): boolean {
        return this.allowed.includes("png") && mimeType === "image/png";
    }

    private isJpg(mimeType: string): boolean {
        return this.allowed.includes("jpg") && /image\/jpe?g/.test(mimeType);
    }
}
