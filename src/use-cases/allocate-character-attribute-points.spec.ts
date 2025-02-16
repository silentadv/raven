import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { AllocateCharacterAttributePointsUseCase } from "./allocate-character-attribute-points";
import { InvalidAttributePointsAllocation } from "./errors/InvalidAttributePointsAllocation";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let charactersRepository: InMemoryCharactersRepository;
let sut: AllocateCharacterAttributePointsUseCase;

describe("Allocate Character Attribute Points Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    charactersRepository = new InMemoryCharactersRepository();
    sut = new AllocateCharacterAttributePointsUseCase(
      usersRepository,
      charactersRepository
    );
  });

  it("should be able to allocate character points.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    const character = await charactersRepository.create({
      user_id: "user-01",
      guild_id: "guild-01",
      name: "John Doe",
    });

    const { character: updatedCharacter } = await sut.handle({
      userCharacterId: character.id,
      userDiscordId: "user-01",
      strength: 10,
    });

    expect(updatedCharacter.id).toEqual(expect.any(String));
  });

  it("should not be able to allocate character points in an inexistent user", async () => {
    const character = await charactersRepository.create({
      user_id: "user-01",
      guild_id: "guild-01",
      name: "John Doe",
    });

    await expect(() =>
      sut.handle({
        userCharacterId: character.id,
        userDiscordId: "user-01",
        strength: 10,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to allocate character points in an inexistent character", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userCharacterId: "character-invalid",
        userDiscordId: "user-01",
        strength: 10,
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to allocate negative amount of character points.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    const character = await charactersRepository.create({
      user_id: "user-01",
      guild_id: "guild-01",
      name: "John Doe",
    });

    await expect(() =>
      sut.handle({
        userCharacterId: character.id,
        userDiscordId: "user-01",
        strength: -10,
      })
    ).rejects.toBeInstanceOf(InvalidAttributePointsAllocation);
  });

  it("should not be able to allocate zero character points.", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    const character = await charactersRepository.create({
      user_id: "user-01",
      guild_id: "guild-01",
      name: "John Doe",
    });

    await expect(() =>
      sut.handle({
        userCharacterId: character.id,
        userDiscordId: "user-01",
        strength: 0,
      })
    ).rejects.toBeInstanceOf(InvalidAttributePointsAllocation);
  });
});
