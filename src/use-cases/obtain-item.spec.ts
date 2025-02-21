import { describe, it, beforeEach, expect } from "vitest";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { ObtainItemUseCase } from "./obtain-item";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

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
      itemId: "wooden_sword",
      itemCount: 1,
    });

    expect(item.id).toEqual(expect.any(String));
    expect(item.count).toEqual(1);
  });

  it("should not be able to inexistent user obtain item .", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        itemCount: 1,
        itemId: "wooden_sword",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
