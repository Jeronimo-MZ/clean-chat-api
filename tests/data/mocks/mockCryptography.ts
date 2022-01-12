import faker from "@faker-js/faker";

import { Hasher } from "@/data/protocols/cryptography";

export class HasherSpy implements Hasher {
    plaintext: string;
    callsCount = 0;
    digest = faker.datatype.uuid();

    async hash(plaintext: string): Promise<string> {
        this.plaintext = plaintext;
        this.callsCount++;
        return this.digest;
    }
}
