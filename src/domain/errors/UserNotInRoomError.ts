export class UserNotInRoomError extends Error {
    constructor() {
        super("User not in Room.");
        this.name = "UserNotInRoomError";
    }
}
