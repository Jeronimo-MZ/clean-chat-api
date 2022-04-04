import { InvalidBufferError, MaxFileSizeError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { Validation } from "@/validation/protocols";

export class MaxFileSizeValidation implements Validation {
    constructor(private readonly maxSizeInMb: number, private readonly field: string) {}

    validate(input: any): MaxFileSizeError | null {
        if (!isAbsent(input[this.field])) {
            if (!(input[this.field] instanceof Buffer)) {
                return new InvalidBufferError(this.field);
            }
            const maxFileSizeInBytes = this.maxSizeInMb * 1024 * 1024;
            if (input[this.field].length > maxFileSizeInBytes)
                return new MaxFileSizeError(this.field, this.maxSizeInMb);
        }
        return null;
    }
}
