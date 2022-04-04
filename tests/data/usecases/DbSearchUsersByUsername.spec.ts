import { SearchUsersByUsernameRepository } from "@/data/protocols/database";
import { DbSearchUsersByUsername } from "@/data/usecases";
import { SearchUsersByUsername } from "@/domain/usecases";
import { SearchUsersByUsernameRepositorySpy } from "@/tests/data/mocks";
import { mockSearchUsersByUsernameInput, throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbSearchUsersByUsername;
    searchUsersByUsernameRepositorySpy: SearchUsersByUsernameRepositorySpy;
};

const makeSut = (): SutTypes => {
    const searchUsersByUsernameRepositorySpy = new SearchUsersByUsernameRepositorySpy();

    const sut = new DbSearchUsersByUsername(searchUsersByUsernameRepositorySpy);

    return { sut, searchUsersByUsernameRepositorySpy };
};

describe("DbSearchUsersByUsername", () => {
    it("should call SearchUsersByUsernameRepository with correct values", async () => {
        const { sut, searchUsersByUsernameRepositorySpy } = makeSut();
        const input = mockSearchUsersByUsernameInput();
        await sut.search(input);
        expect(searchUsersByUsernameRepositorySpy.input).toStrictEqual<SearchUsersByUsernameRepository.Input>({
            page: input.page,
            pageSize: input.pageSize,
            username: input.username,
        });
        expect(searchUsersByUsernameRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if SearchUsersByUsernameRepository throws", async () => {
        const { sut, searchUsersByUsernameRepositorySpy } = makeSut();
        jest.spyOn(searchUsersByUsernameRepositorySpy, "searchByUsername").mockImplementationOnce(throwError);
        const promise = sut.search(mockSearchUsersByUsernameInput());
        await expect(promise).rejects.toThrowError(new Error());
    });

    it("should return correct values on success", async () => {
        const { sut, searchUsersByUsernameRepositorySpy } = makeSut();
        const input = mockSearchUsersByUsernameInput();
        const output = await sut.search(input);
        expect(output).toStrictEqual<SearchUsersByUsername.Output>(searchUsersByUsernameRepositorySpy.output);
        expect(searchUsersByUsernameRepositorySpy.callsCount).toBe(1);
    });
});
