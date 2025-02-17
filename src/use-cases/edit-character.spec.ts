import { describe, it, beforeEach, expect } from "vitest";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { EditCharacterUseCase } from "./edit-character";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let charactersRepository: InMemoryCharactersRepository;
let sut: EditCharacterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    charactersRepository = new InMemoryCharactersRepository();
    sut = new EditCharacterUseCase(charactersRepository);
  });

  it("should be able to edit an character.", async () => {
    const character = await charactersRepository.create({
      name: "John Doe",
      user_id: "user-01",
      guild_id: "guild-01",
    });

    const { character: updatedCharacter } = await sut.handle({
      characterId: character.id,
      character: {
        name: "Doe John",
      },
    });

    expect(updatedCharacter.name).toBe("Doe John");
  });

  it("should not be able to edit an inexistent character.", async () => {
    await expect(() =>
      sut.handle({
        characterId: "character-01",
        character: {
          name: "Doe John",
        },
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
