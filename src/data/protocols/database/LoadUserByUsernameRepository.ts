import { User } from "@/domain/models";

export interface LoadUserByUsernameRepository {
    loadByUsername(username: string): Promise<User | null>;
}
