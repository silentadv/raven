import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { GetProfileUseCase } from "./get-profile";

let usersRepository: InMemoryUsersRepository;
let sut: GetProfileUseCase;

describe("Get Profile Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetProfileUseCase(usersRepository);
  });

  it("should be able to get profile", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    const { user } = await sut.handle({
      userDiscordId: "user-01",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to get profile of an inexistent user.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
