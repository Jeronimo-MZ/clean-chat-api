import { SearchUsersByUsernameRepository } from "@/data/protocols/database";
import { DbSearchUsersByUsername } from "@/data/usecases";
import { SearchUsersByUsernameRepositorySpy } from "@/tests/data/mocks";
import { mockSearchUsersByUsernameInput } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbSearchUsersByUsername;
    searchUsersByUsernameRepositorySpy: SearchUsersByUsernameRepositorySpy;
};

const makeSut = (): SutTypes => {
    const searchUsersByUsernameRepositorySpy =
        new SearchUsersByUsernameRepositorySpy();

    const sut = new DbSearchUsersByUsername(searchUsersByUsernameRepositorySpy);

    return { sut, searchUsersByUsernameRepositorySpy };
};

describe("DbSearchUsersByUsername", () => {
    it("should call SearchUsersByUsernameRepository with correct values", async () => {
        const { sut, searchUsersByUsernameRepositorySpy } = makeSut();
        const input = mockSearchUsersByUsernameInput();
        await sut.search(input);
        expect(
            searchUsersByUsernameRepositorySpy.input,
        ).toStrictEqual<SearchUsersByUsernameRepository.Input>({
            page: input.page,
            pageSize: input.pageSize,
            username: input.username,
        });
        expect(searchUsersByUsernameRepositorySpy.callsCount).toBe(1);
    });
});
