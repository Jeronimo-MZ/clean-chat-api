import faker from "@faker-js/faker";

import {
    Decrypter,
    Encrypter,
    HashComparer,
    Hasher,
    UUIDGenerator,
} from "@/data/protocols/cryptography";

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
    callsCount = 0;

    async encrypt(plaintext: string): Promise<string> {
        this.plaintext = plaintext;
        this.callsCount++;
        return this.ciphertext;
    }
}

export class DecrypterSpy implements Decrypter {
    plaintext: string | null = faker.internet.password();
    ciphertext: string;
    callsCount = 0;

    async decrypt(ciphertext: string): Promise<string | null> {
        this.ciphertext = ciphertext;
        this.callsCount++;
        return this.plaintext;
    }
}

export class UUIDGeneratorStub implements UUIDGenerator {
    uuid: string = faker.datatype.uuid();
    callsCount = 0;
    generate(): string {
        this.callsCount++;
        return this.uuid;
    }
}
