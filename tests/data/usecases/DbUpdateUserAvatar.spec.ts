import faker from "@faker-js/faker";

import { DbUpdateUserAvatar } from "@/data/usecases";
import { UserNotFoundError } from "@/domain/errors";
import {
    DeleteFileMock,
    LoadUserByIdRepositorySpy,
    SaveFileSpy,
    UpdateUserAvatarRepositorySpy,
    UUIDGeneratorStub,
} from "@/tests/data/mocks";
import { mockUpdateUserAvatarInput, throwError } from "@/tests/domain/mocks";

type SutTypes = {
    sut: DbUpdateUserAvatar;
    loadUserByIdRepositorySpy: LoadUserByIdRepositorySpy;
    uuidGeneratorStub: UUIDGeneratorStub;
    saveFileSpy: SaveFileSpy;
    updateUserAvatarRepositorySpy: UpdateUserAvatarRepositorySpy;
    deleteFileMock: DeleteFileMock;
};

const makeSut = (): SutTypes => {
    const loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy();
    const uuidGeneratorStub = new UUIDGeneratorStub();
    const updateUserAvatarRepositorySpy = new UpdateUserAvatarRepositorySpy();
    const saveFileSpy = new SaveFileSpy();
    const deleteFileMock = new DeleteFileMock();

    const sut = new DbUpdateUserAvatar(
        loadUserByIdRepositorySpy,
        uuidGeneratorStub,
        saveFileSpy,
        updateUserAvatarRepositorySpy,
        deleteFileMock,
    );
    return {
        sut,
        loadUserByIdRepositorySpy,
        uuidGeneratorStub,
        saveFileSpy,
        updateUserAvatarRepositorySpy,
        deleteFileMock,
    };
};

describe("DbUpdateUserAvatar", () => {
    it("should call LoadUserByIdRespository with correct id", async () => {
        const { sut, loadUserByIdRepositorySpy } = makeSut();
        const input = mockUpdateUserAvatarInput();
        await sut.update(input);
        expect(loadUserByIdRepositorySpy.id).toBe(input.userId);
        expect(loadUserByIdRepositorySpy.callsCount).toBe(1);
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

    it("should call UUIDGenerator", async () => {
        const { sut, uuidGeneratorStub } = makeSut();
        await sut.update(mockUpdateUserAvatarInput());
        expect(uuidGeneratorStub.callsCount).toBe(1);
    });

    it("should not call UUIDGenerator if LoadUserByIdRepository returns null", async () => {
        const { sut, uuidGeneratorStub, loadUserByIdRepositorySpy } = makeSut();
        loadUserByIdRepositorySpy.result = null;
        await sut.update(mockUpdateUserAvatarInput());
        expect(uuidGeneratorStub.callsCount).toBe(0);
    });

    it("should call SaveFile with correct values", async () => {
        const { sut, uuidGeneratorStub, saveFileSpy } = makeSut();
        const input = mockUpdateUserAvatarInput();
        await sut.update(input);
        expect(saveFileSpy.file).toBe(input.file.buffer);
        expect(saveFileSpy.fileName).toBe(`${uuidGeneratorStub.uuid}.jpeg`);
        expect(saveFileSpy.callsCount).toBe(1);
    });

    it("should throw if SaveFile throws", async () => {
        const { sut, saveFileSpy } = makeSut();
        jest.spyOn(saveFileSpy, "save").mockImplementationOnce(throwError);
        const promise = sut.update(mockUpdateUserAvatarInput());
        await expect(promise).rejects.toThrow();
    });

    it("should call UpdateUserAvatarRepository with correct values", async () => {
        const {
            sut,
            updateUserAvatarRepositorySpy,
            loadUserByIdRepositorySpy,
            saveFileSpy,
        } = makeSut();
        await sut.update(mockUpdateUserAvatarInput());
        expect(updateUserAvatarRepositorySpy.userId).toBe(
            loadUserByIdRepositorySpy.result?.id,
        );
        expect(updateUserAvatarRepositorySpy.avatar).toBe(saveFileSpy.output);
        expect(updateUserAvatarRepositorySpy.callsCount).toBe(1);
    });

    it("should throw if UpdateUserAvatarRepository throws", async () => {
        const { sut, updateUserAvatarRepositorySpy } = makeSut();
        jest.spyOn(
            updateUserAvatarRepositorySpy,
            "updateAvatar",
        ).mockImplementationOnce(throwError);
        const promise = sut.update(mockUpdateUserAvatarInput());
        await expect(promise).rejects.toThrow();
    });

    it("should call DeleteFile after update if user already had an avatar", async () => {
        const {
            sut,
            deleteFileMock,
            loadUserByIdRepositorySpy,
            updateUserAvatarRepositorySpy,
        } = makeSut();
        if (loadUserByIdRepositorySpy.result)
            loadUserByIdRepositorySpy.result.avatar = faker.internet.avatar();
        await sut.update(mockUpdateUserAvatarInput());

        expect(updateUserAvatarRepositorySpy.callsCount).toBe(1);
        expect(deleteFileMock.fileName).toBe(
            loadUserByIdRepositorySpy.result?.avatar,
        );
        expect(deleteFileMock.callsCount).toBe(1);
    });

    it("should not call DeleteFile if user's avatar was null", async () => {
        const { sut, deleteFileMock } = makeSut();
        await sut.update(mockUpdateUserAvatarInput());
        expect(deleteFileMock.fileName).toBeUndefined();
    });

    it("should return correct avatar on success", async () => {
        const { sut, saveFileSpy } = makeSut();
        const result = await sut.update(mockUpdateUserAvatarInput());
        expect(result).toEqual({ avatarUrl: saveFileSpy.output });
    });
});
