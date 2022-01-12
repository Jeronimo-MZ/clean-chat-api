import bcrypt from "bcrypt";

import { Hasher } from "@/data/protocols/cryptography";

export class BcryptAdapter implements Hasher {
    constructor(private readonly salt: number) {}

    async hash(plaintext: string): Promise<string> {
        return bcrypt.hash(plaintext, this.salt);
    }
}
