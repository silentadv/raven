import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { InspectItemUseCase } from "./inspect-item";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ItemType } from "@prisma/client";

let usersRepository: InMemoryUsersRepository;
let itemsRepository: InMemoryItemsRepository;
let sut: InspectItemUseCase;

describe("Inspect Item Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    itemsRepository = new InMemoryItemsRepository();
    sut = new InspectItemUseCase(usersRepository, itemsRepository);
  });

  it("should be able to inspect an item.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await itemsRepository.create({
      user_id: "user-01",
      item_id: "prisma",
      type: ItemType.Currency,
      count: 10,
    });

    const { item } = await sut.handle({
      userDiscordId: "user-01",
      itemId: "prisma",
    });

    expect(item!.id).toEqual(expect.any(Number));
  });

  it("should not be able to an inexistent user inspect item .", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        itemId: "prisma",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
