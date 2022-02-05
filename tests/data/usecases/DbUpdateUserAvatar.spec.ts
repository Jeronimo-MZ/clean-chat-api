import { DbUpdateUserAvatar } from "@/data/usecases";
import { UserNotFoundError } from "@/domain/errors";
import { LoadUserByIdRepositorySpy } from "@/tests/data/mocks";
import { mockUpdateUserAvatarInput, throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbUpdateUserAvatar;
    loadUserByIdRepositorySpy: LoadUserByIdRepositorySpy;
};

const makeSut = (): SutTypes => {
    const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy();

    const sut = new DbUpdateUserAvatar(loadUserByIdRepositorySpy);
    return {
        sut,
        loadUserByIdRepositorySpy,
    };
};

describe("DbUpdateUserAvatar", () => {
    it("should call LoadUserByIdRespository with correct id", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        const input = mockUpdateUserAvatarInput();
        await sut.update(input);
        expect(loadUserByIdRepositorySpy.id).toBe(input.userId);
    });

    it("should return UserNotFoundError if LoadUserByIdRepository returns null", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        loadUserByIdRepositorySpy.result = null;
        const output = await sut.update(mockUpdateUserAvatarInput());
        expect(output).toEqual(new UserNotFoundError());
    });

    it("should throw if LoadUserByIdRepository throws", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        jest.spyOn(
            loadUserByIdRepositorySpy,
            "loadById",
        ).mockImplementationOnce(throwError);
        const promise = sut.update(mockUpdateUserAvatarInput());
        await expect(promise).rejects.toThrow();
    });
});
