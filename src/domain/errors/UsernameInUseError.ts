export class UsernameInUseError extends Error {
    constructor() {
        super("Username already used.");
        this.name = "UsernameInUseError";
    }
}
