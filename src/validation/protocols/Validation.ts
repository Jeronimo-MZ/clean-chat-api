export interface Validation {
    validate(input: Validation.Input): Error | null;
}

export namespace Validation {
    export type Input = {
        [key: string]: string | number | object;
    };
}
