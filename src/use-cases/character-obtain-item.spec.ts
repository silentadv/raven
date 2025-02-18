import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { CharacterObtainItemUseCase } from "./character-obtain-item";

let charactersRepository: InMemoryCharactersRepository;
let itemsRepository: InMemoryItemsRepository;
let sut: CharacterObtainItemUseCase;

describe("Character Obtain Item Use Case", () => {
  beforeEach(() => {
    charactersRepository = new InMemoryCharactersRepository();
    itemsRepository = new InMemoryItemsRepository();
    sut = new CharacterObtainItemUseCase(charactersRepository, itemsRepository);
  });

  it("should be able to obtain an item.", async () => {
    await charactersRepository.create({
      id: "character-01",
      name: "John Doe",
      user_id: "user-01",
      guild_id: "guild-01",
    });

    const { item } = await sut.handle({
      characterId: "character-01",
      itemCount: 1,
      itemId: "wooden_sword",
    });

    expect(item.id).toEqual(expect.any(String));
    expect(item.count).toEqual(1);
  });

  it("should not be able to inexistent character obtain an item .", async () => {
    await expect(() =>
      sut.handle({
        characterId: "character-01",
        itemCount: 1,
        itemId: "wooden_sword",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
