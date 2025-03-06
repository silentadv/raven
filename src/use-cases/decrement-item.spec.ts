import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { ObtainItemUseCase } from "./obtain-item";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ItemType } from "@prisma/client";
import { DecrementItemUseCase } from "./decrement-item";

let usersRepository: InMemoryUsersRepository;
let itemsRepository: InMemoryItemsRepository;
let sut: DecrementItemUseCase;

describe("Decrement Item Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    itemsRepository = new InMemoryItemsRepository();
    sut = new DecrementItemUseCase(itemsRepository, usersRepository);
  });

  it("should be able to decrement item.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await itemsRepository.create({
      item_id: "prisma",
      user_id: "user-01",
      type: ItemType.Currency,
      count: 10,
    });

    const { item } = await sut.handle({
      userDiscordId: "user-01",
      itemId: "prisma",
      itemCount: 10,
    });

    expect(item.id).toEqual(expect.any(Number));
    expect(item.count).toEqual(0);
  });

  it("should not be able to decrement inexistent item.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        itemId: "ravits",
        itemCount: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to decrement item for inexistent user.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        itemId: "ravits",
        itemCount: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
