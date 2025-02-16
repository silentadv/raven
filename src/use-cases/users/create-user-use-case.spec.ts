import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { CreateUserUseCase } from "./create-user-use-case";
import { describe, it, beforeEach, expect } from "vitest";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe("Create User Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create an user.", async () => {
    const { user } = await sut.handle({
      userDiscordId: "user-01",
      userCharacterName: "John Doe",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to create an user with same discord id.", async () => {
    const { user } = await sut.handle({
      userDiscordId: "user-01",
      userCharacterName: "John Doe",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        userCharacterName: "John Doe",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
