import { LoadUserByUsernameRepository } from "@/data/protocols/database/LoadUserByUsernameRepository";
import { User } from "@/domain/models";
import { mockUserModel } from "@/tests/domain/mocks";

export class LoadUserByUsernameRepositorySpy
    implements LoadUserByUsernameRepository
{
    username: string;
    result: User | null = mockUserModel();

    async loadByUsername(username: string): Promise<User | null> {
        this.username = username;
        return this.result;
    }
}
