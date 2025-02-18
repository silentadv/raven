import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryItemsRepository } from "@/repositories/in-memory/in-memory-items-repository";
import { CharacterInspectItemUseCase } from "./character-inspect-item";

let charactersRepository: InMemoryCharactersRepository;
let itemsRepository: InMemoryItemsRepository;
let sut: CharacterInspectItemUseCase;

describe("Character Obtain Item Use Case", () => {
  beforeEach(() => {
    charactersRepository = new InMemoryCharactersRepository();
    itemsRepository = new InMemoryItemsRepository();
    sut = new CharacterInspectItemUseCase(
      charactersRepository,
      itemsRepository
    );
  });

  it("should be able to inspect an item.", async () => {
    await charactersRepository.create({
      id: "character-01",
      name: "John Doe",
      user_id: "user-01",
      guild_id: "guild-01",
    });

    await itemsRepository.create({
      character_id: "character-01",
      item_id: "item-01",
    });

    const { item } = await sut.handle({
      characterId: "character-01",
      itemId: "item-01",
    });

    expect(item.id).toEqual(expect.any(String));
  });

  it("should not be able to inexistent character inspect an item .", async () => {
    await expect(() =>
      sut.handle({
        characterId: "character-01",
        itemId: "wooden_sword",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to obtain an inexistent item .", async () => {
    await charactersRepository.create({
      id: "character-01",
      name: "John Doe",
      user_id: "user-01",
      guild_id: "guild-01",
    });

    await expect(() =>
      sut.handle({
        characterId: "character-01",
        itemId: "wooden_sword",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
