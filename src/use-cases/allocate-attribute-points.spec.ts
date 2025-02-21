import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { AllocateAttributePointsUseCase } from "./allocate-attribute-points";
import { InvalidAttributePointsAllocation } from "./errors/InvalidAttributePointsAllocation";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let sut: AllocateAttributePointsUseCase;

describe("Allocate Character Attribute Points Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AllocateAttributePointsUseCase(usersRepository);
  });

  it("should be able to allocate attribute points.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    const { user } = await sut.handle({
      userDiscordId: "user-01",
      strength: 10,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.strength).toEqual(11);
  });

  it("should not be able to allocate attribute points in an inexistent user", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        strength: 10,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to allocate negative amount of character points.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        strength: -10,
      })
    ).rejects.toBeInstanceOf(InvalidAttributePointsAllocation);
  });

  it("should not be able to allocate zero character points.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        strength: 0,
      })
    ).rejects.toBeInstanceOf(InvalidAttributePointsAllocation);
  });
});
