import { Validation } from "@/validation/protocols";

export class ObjectValidation implements Validation {
    constructor(
        private readonly fieldname: string,
        private readonly validations: Validation[],
    ) {}

    validate(_input: Validation.Input): Error | null {
        return null;
    }
}
