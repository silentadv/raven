import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { CreateCharacterUseCase } from "./create-character";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let charactersRepository: InMemoryCharactersRepository;
let sut: CreateCharacterUseCase;

describe("Create Character Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    charactersRepository = new InMemoryCharactersRepository();
    sut = new CreateCharacterUseCase(usersRepository, charactersRepository);
  });

  it("should be able to create an character.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    const { character } = await sut.handle({
      userDiscordId: "user-01",
      characterGuildId: "guild-01",
      characterName: "John Doe",
    });

    expect(character.id).toEqual(expect.any(String));
  });

  it("should not be able to create an character in an inexistent user.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "invalid-id",
        characterGuildId: "guild-01",
        characterName: "John Doe",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
