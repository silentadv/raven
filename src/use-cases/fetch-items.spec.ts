import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ItemType } from "@prisma/client";
import { FetchItemsUseCase } from "./fetch-items";

let usersRepository: InMemoryUsersRepository;
let itemsRepository: InMemoryItemsRepository;
let sut: FetchItemsUseCase;

describe("Decrement Item Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    itemsRepository = new InMemoryItemsRepository();
    sut = new FetchItemsUseCase(usersRepository, itemsRepository);
  });

  it("should be able to fetch items.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    for (let i = 1; i <= 5; i++)
      await itemsRepository.create({
        item_id: `item-${i}`,
        user_id: "user-01",
        type: ItemType.Tool,
        count: 10,
      });

    const { items } = await sut.handle({
      userDiscordId: "user-01",
    });

    expect(items).toHaveLength(5);
    expect(items).toEqual([
      expect.objectContaining({ item_id: `item-1` }),
      expect.objectContaining({ item_id: `item-2` }),
      expect.objectContaining({ item_id: `item-3` }),
      expect.objectContaining({ item_id: `item-4` }),
      expect.objectContaining({ item_id: `item-5` }),
    ]);
  });

  it("should not be able to fetch inexistent user items.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
