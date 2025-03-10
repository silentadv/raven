import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InMemoryFishingRepository } from "@/repositories/in-memory/in-memory-fishing-repository";
import { ObtainFishingDropUseCase } from "./obtain-fishing-drop";

let usersRepository: InMemoryUsersRepository;
let fishingRepository: InMemoryFishingRepository;
let sut: ObtainFishingDropUseCase;

describe("Obtain Fishing Drop Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    fishingRepository = new InMemoryFishingRepository();
    sut = new ObtainFishingDropUseCase(usersRepository, fishingRepository);
  });

  it("should be able to obtain fishing drop.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await fishingRepository.create({
      userDiscordId: "user-01",
      tools: {
        rod: "basic_rod",
        bait: "worm_bait",
      },
    });

    const { fishing } = await sut.handle({
      userDiscordId: "user-01",
      dropId: "fish-01",
    });

    expect(fishing.userDiscordId).toEqual("user-01");
    expect(fishing.drops).toEqual([
      expect.objectContaining({ id: "fish-01", count: 1 }),
    ]);
  });

  it("should be able to obtain same fishing drop.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await fishingRepository.create({
      userDiscordId: "user-01",
      tools: {
        rod: "basic_rod",
        bait: "worm_bait",
      },
    });

    await sut.handle({
      userDiscordId: "user-01",
      dropId: "fish-01",
    });

    const { fishing } = await sut.handle({
      userDiscordId: "user-01",
      dropId: "fish-01",
    });

    expect(fishing.userDiscordId).toEqual("user-01");
    expect(fishing.drops).toEqual([
      expect.objectContaining({ id: "fish-01", count: 2 }),
    ]);
  });

  it("should not be able to obtain drop in an non existent session.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        dropId: "fish-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to inexistent user obtain fishing drop.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        dropId: "fish-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
