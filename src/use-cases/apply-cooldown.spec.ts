import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryCooldownsRepository } from "@/repositories/in-memory/in-memory-cooldowns-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ApplyCooldownUseCase } from "./apply-cooldown";
import { CooldownType } from "@prisma/client";

let cooldownsRepository: InMemoryCooldownsRepository;
let usersRepository: InMemoryUsersRepository;
let sut: ApplyCooldownUseCase;

describe("Apply Cooldown Use Case", () => {
  beforeEach(() => {
    cooldownsRepository = new InMemoryCooldownsRepository();
    usersRepository = new InMemoryUsersRepository();
    sut = new ApplyCooldownUseCase(cooldownsRepository, usersRepository);
  });

  it("should be able to apply an cooldown.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    const { cooldown } = await sut.handle({
      cooldownDate: new Date(),
      cooldownType: CooldownType.Daily,
      userDiscordId: "user-01",
    });

    expect(cooldown.id).toEqual(expect.any(Number));
  });

  it("should not be able to apply cooldown on an inexistent user.", async () => {
    await expect(() =>
      sut.handle({
        cooldownDate: new Date(),
        cooldownType: CooldownType.Daily,
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
