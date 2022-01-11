import { Hasher } from "@/data/protocols/cryptography";

export class HasherSpy implements Hasher {
    plaintext: string;
    digest = "digest";

    async hash(plaintext: string): Promise<string> {
        this.plaintext = plaintext;
        return this.digest;
    }
}
