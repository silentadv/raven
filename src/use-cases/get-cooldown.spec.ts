import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryCooldownsRepository } from "@/repositories/in-memory/in-memory-cooldowns-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { CooldownType } from "@prisma/client";
import { GetCooldownUseCase } from "./get-cooldown";

let cooldownsRepository: InMemoryCooldownsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetCooldownUseCase;

describe("Get Cooldown Use Case", () => {
  beforeEach(() => {
    cooldownsRepository = new InMemoryCooldownsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new GetCooldownUseCase(cooldownsRepository, usersRepository);
  });

  it("should be able to get cooldown.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await cooldownsRepository.create({
      user_id: "user-01",
      type: CooldownType.Daily,
      date: new Date(),
    });

    const { cooldown } = await sut.handle({
      cooldownType: CooldownType.Daily,
      userDiscordId: "user-01",
    });

    expect(cooldown!.id).toEqual(expect.any(Number));
  });

  it("should not be able to get cooldown of an inexistent user.", async () => {
    await cooldownsRepository.create({
      user_id: "user-01",
      type: CooldownType.Daily,
      date: new Date(),
    });

    await expect(() =>
      sut.handle({
        cooldownType: CooldownType.Daily,
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
