import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { ObtainItemUseCase } from "./obtain-item";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ItemType } from "@prisma/client";

let usersRepository: InMemoryUsersRepository;
let itemsRepository: InMemoryItemsRepository;
let sut: ObtainItemUseCase;

describe("Obtain Item Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    itemsRepository = new InMemoryItemsRepository();
    sut = new ObtainItemUseCase(usersRepository, itemsRepository);
  });

  it("should be able to obtain item.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    const { item } = await sut.handle({
      userDiscordId: "user-01",
      itemType: ItemType.Currency,
      itemId: "prisma",
      itemCount: 1,
    });

    expect(item.id).toEqual(expect.any(Number));
    expect(item.count).toEqual(1);
  });

  it("should not be able to inexistent user obtain item .", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        itemType: ItemType.Currency,
        itemId: "ravits",
        itemCount: 1,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
