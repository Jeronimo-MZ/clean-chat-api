import { ObjectId } from "mongodb";

import { ObjectIdValidator } from "@/validation/protocols";

export class ObjectIdValidatorAdapter implements ObjectIdValidator {
    isValid(input: any): boolean {
        return ObjectId.isValid(input);
    }
}
