import { MaxFileSizeError } from "@/validation/errors";
import { Validation } from "@/validation/protocols";

export class MaxFileSizeValidation implements Validation {
    constructor(
        private readonly maxSizeInMb: number,
        private readonly field: string,
    ) {}

    validate(_input: any): MaxFileSizeError | null {
        return null;
    }
}
