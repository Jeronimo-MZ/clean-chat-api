import { Hasher } from "@/data/protocols/cryptography";

export class HasherSpy implements Hasher {
    plaintext: string;
    callsCount = 0;
    digest = "digest";

    async hash(plaintext: string): Promise<string> {
        this.plaintext = plaintext;
        this.callsCount++;
        return this.digest;
    }
}
