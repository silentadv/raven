import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { RegisterUseCase } from "./register";
import { describe, it, beforeEach, expect } from "vitest";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should be able to register an user.", async () => {
    const { user } = await sut.handle({
      userDiscordId: "user-01",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to register an user with same discord id.", async () => {
    await sut.handle({
      userDiscordId: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
