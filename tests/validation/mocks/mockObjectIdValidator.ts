import { ObjectIdValidator } from "@/validation/protocols";

export class ObjectIdValidatorSpy implements ObjectIdValidator {
    input: any;
    result = true;
    callsCount = 0;

    isValid(input: any): boolean {
        this.input = input;
        this.callsCount++;
        return this.result;
    }
}
