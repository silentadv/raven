import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { StartFishingUseCase } from "./start-fishing";
import { InMemoryFishingRepository } from "@/repositories/in-memory/in-memory-fishing-repository";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { ItemType } from "@prisma/client";
import { FishingSessionAlreadyExistsError } from "./errors/FishingSessionAlreadyExistsError";

let usersRepository: InMemoryUsersRepository;
let itemsRepository: InMemoryItemsRepository;
let fishingRepository: InMemoryFishingRepository;
let sut: StartFishingUseCase;

describe("Start Fishing Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    itemsRepository = new InMemoryItemsRepository();
    fishingRepository = new InMemoryFishingRepository();
    sut = new StartFishingUseCase(
      usersRepository,
      itemsRepository,
      fishingRepository
    );
  });

  it("should be able to start fishing.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await itemsRepository.create({
      user_id: "user-01",
      item_id: "bait-01",
      type: ItemType.Tool,
    });

    await itemsRepository.create({
      user_id: "user-01",
      item_id: "rod-01",
      type: ItemType.Tool,
    });

    const { fishing } = await sut.handle({
      userDiscordId: "user-01",
      bait: "bait-01",
      rod: "rod-01",
    });

    expect(fishing.userDiscordId).toEqual("user-01");
  });

  it("should not be able to start fishing if user already is fishing.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await itemsRepository.create({
      user_id: "user-01",
      item_id: "bait-01",
      type: ItemType.Tool,
    });

    await itemsRepository.create({
      user_id: "user-01",
      item_id: "rod-01",
      type: ItemType.Tool,
    });

    await sut.handle({
      userDiscordId: "user-01",
      bait: "bait-01",
      rod: "rod-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        bait: "bait-01",
        rod: "rod-01",
      })
    ).rejects.toBeInstanceOf(FishingSessionAlreadyExistsError);
  });

  it("should not be able to start fishing with invalid tools.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        bait: "bait-01",
        rod: "rod-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to inexistent user start fishing.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        bait: "bait-01",
        rod: "rod-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
