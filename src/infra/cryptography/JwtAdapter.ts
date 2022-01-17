import { sign, verify } from "jsonwebtoken";

import { Decrypter, Encrypter } from "@/data/protocols/cryptography";

export class JwtAdapter implements Encrypter, Decrypter {
    constructor(private readonly secret: string) {}
    async encrypt(plaintext: string): Promise<string> {
        return sign({ data: plaintext }, this.secret, { expiresIn: "1d" });
    }

    async decrypt(token: string): Promise<string | null> {
        try {
            await verify(token, this.secret);
            return null;
        } catch {
            return null;
        }
    }
}
