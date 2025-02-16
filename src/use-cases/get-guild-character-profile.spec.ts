import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InMemoryGuildsRepository } from "@/repositories/in-memory/in-memory-guilds-repository";
import { GetGuildCharacterProfileUseCase } from "./get-guild-character-profile";

let usersRepository: InMemoryUsersRepository;
let charactersRepository: InMemoryCharactersRepository;
let guildsRepository: InMemoryGuildsRepository;
let sut: GetGuildCharacterProfileUseCase;

describe("Create Character Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    charactersRepository = new InMemoryCharactersRepository();
    guildsRepository = new InMemoryGuildsRepository();
    sut = new GetGuildCharacterProfileUseCase(
      usersRepository,
      charactersRepository,
      guildsRepository
    );
  });

  it("should be able to get profile character", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await guildsRepository.create({
      id: "guild-01",
      discord_id: "guild-01",
      name: "Typescript Guild",
    });

    await charactersRepository.create({
      user_id: "user-01",
      guild_id: "guild-01",
      name: "John Doe",
    });

    const { character } = await sut.handle({
      userDiscordId: "user-01",
      guildDiscordId: "guild-01",
    });

    expect(character.id).toEqual(expect.any(String));
  });

  it("should not be able to get character profile of an inexistent user.", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "invalid-id",
        guildDiscordId: "guild-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to get character profile of an inexistent guild.", async () => {
    await usersRepository.create({
      discord_id: "user-01",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        guildDiscordId: "guild-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should be able to get profile character of an inexistent character", async () => {
    await usersRepository.create({
      id: "user-01",
      discord_id: "user-01",
    });

    await guildsRepository.create({
      id: "guild-01",
      discord_id: "guild-01",
      name: "Typescript Guild",
    });

    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
        guildDiscordId: "guild-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
