import faker from "@faker-js/faker";

import { Encrypter, HashComparer, Hasher } from "@/data/protocols/cryptography";

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

export class HashComparerSpy implements HashComparer {
    plaintext: string;
    digest: string;
    isValid = true;

    async compare(plaintext: string, digest: string): Promise<boolean> {
        this.plaintext = plaintext;
        this.digest = digest;
        return this.isValid;
    }
}

export class EncrypterSpy implements Encrypter {
    ciphertext = faker.datatype.uuid();
    plaintext: string;

    async encrypt(plaintext: string): Promise<string> {
        this.plaintext = plaintext;
        return this.ciphertext;
    }
}
