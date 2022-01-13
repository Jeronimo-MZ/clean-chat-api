import { ValidationError } from "@/validation/errors";

export interface Validation {
    validate(input: Validation.Input): ValidationError | null;
}

export namespace Validation {
    export type Input = {
        [key: string]: string;
    };
}
