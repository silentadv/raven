import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { CreateCharacterUseCase } from "./create-character";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryGuildsRepository } from "@/repositories/in-memory/in-memory-guilds-repository";
import { MaxUserCharacterCountError } from "./errors/MaxUserCharacterCountError";

let usersRepository: InMemoryUsersRepository;
let charactersRepository: InMemoryCharactersRepository;
let guildsRepository: InMemoryGuildsRepository;
let sut: CreateCharacterUseCase;

describe("Create Character Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    charactersRepository = new InMemoryCharactersRepository();
    guildsRepository = new InMemoryGuildsRepository();
    sut = new CreateCharacterUseCase(
      usersRepository,
      charactersRepository,
      guildsRepository
    );
  });

  it("should be able to create an character.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await guildsRepository.create({
      discord_id: "guild-01",
      name: "Typescript Guild",
    });

    const { character } = await sut.handle({
      userDiscordId: "user-01",
      characterGuildDiscordId: "guild-01",
      characterName: "John Doe",
    });

    expect(character.id).toEqual(expect.any(String));
  });

  it("should not be able to create an character in an inexistent user.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "invalid-id",
        characterGuildDiscordId: "guild-01",
        characterName: "John Doe",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an character in an inexistent guild.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        characterGuildDiscordId: "guild-01",
        characterName: "John Doe",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create more than one character per guild.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await guildsRepository.create({
      discord_id: "guild-01",
      name: "Typescript Guild",
    });

    await sut.handle({
      characterName: "John Doe",
      characterGuildDiscordId: "guild-01",
      userDiscordId: "user-01",
    });

    await expect(() =>
      sut.handle({
        characterName: "John Doe",
        characterGuildDiscordId: "guild-01",
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(MaxUserCharacterCountError);
  });

  it("should not be able to create more than five characters per user.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    for (let i = 1; i <= 6; i++)
      await guildsRepository.create({
        discord_id: `guild-${i}`,
        name: `Typescript Guild ${i}`,
      });

    for (let i = 1; i <= 5; i++)
      await sut.handle({
        characterName: "John Doe",
        characterGuildDiscordId: `guild-${i}`,
        userDiscordId: "user-01",
      });

    await expect(() =>
      sut.handle({
        characterName: "John Doe",
        characterGuildDiscordId: `guild-6`,
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(MaxUserCharacterCountError);
  });
});
