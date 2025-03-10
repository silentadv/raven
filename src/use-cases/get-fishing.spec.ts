import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { GetFishingUseCase } from "./get-fishing";
import { InMemoryFishingRepository } from "@/repositories/in-memory/in-memory-fishing-repository";

let usersRepository: InMemoryUsersRepository;
let fishingRepository: InMemoryFishingRepository;
let sut: GetFishingUseCase;

describe("Get Fishing Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    fishingRepository = new InMemoryFishingRepository();
    sut = new GetFishingUseCase(usersRepository, fishingRepository);
  });

  it("should be able to get fishing session", async () => {
    await usersRepository.create({
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
    });

    expect(fishing.userDiscordId).toEqual("user-01");
  });

  it("should not be able to get inexistent fishing session.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to inexistent user get fishing session.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
