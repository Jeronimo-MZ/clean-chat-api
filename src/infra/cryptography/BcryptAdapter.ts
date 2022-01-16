import bcrypt from "bcrypt";

import { HashComparer, Hasher } from "@/data/protocols/cryptography";

export class BcryptAdapter implements Hasher, HashComparer {
    constructor(private readonly salt: number) {}

    async hash(plaintext: string): Promise<string> {
        return bcrypt.hash(plaintext, this.salt);
    }

    async compare(payload: string, digest: string): Promise<boolean> {
        return bcrypt.compare(payload, digest);
    }
}
