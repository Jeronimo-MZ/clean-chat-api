import { InvalidBufferError, MaxFileSizeError } from "@/validation/errors";
import { isAbsent } from "@/validation/helpers";
import { Validation } from "@/validation/protocols";

export class MaxFileSizeValidation implements Validation {
    constructor(
        private readonly maxSizeInMb: number,
        private readonly field: string,
    ) {}

    validate(input: any): MaxFileSizeError | null {
        if (
            !isAbsent(input[this.field]) &&
            !(input[this.field] instanceof Buffer)
        )
            return new InvalidBufferError(this.field);
        return null;
    }
}
