import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryCharactersRepository } from "@/repositories/in-memory/in-memory-characters-repository";
import { FetchUserCharactersUseCase } from "./fetch-user-characters";
import { InMemoryGuildsRepository } from "@/repositories/in-memory/in-memory-guilds-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

let usersRepository: InMemoryUsersRepository;
let charactersRepository: InMemoryCharactersRepository;

let sut: FetchUserCharactersUseCase;

describe("Fetch User Characters Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    charactersRepository = new InMemoryCharactersRepository();
    sut = new FetchUserCharactersUseCase(usersRepository, charactersRepository);
  });

  it("should be able to fetch user characters.", async () => {
    const user = await usersRepository.create({
      discord_id: "user-01",
    });

    await charactersRepository.create({
      guild_id: "guild-01",
      user_id: user.id,
      name: "John Doe 1",
    });

    await charactersRepository.create({
      guild_id: "guild-02",
      user_id: user.id,
      name: "John Doe 2",
    });

    const { characters: characterList } = await sut.handle({
      userDiscordId: "user-01",
    });

    expect(characterList).toHaveLength(2);
    expect(characterList).toEqual([
      expect.objectContaining({ name: "John Doe 1" }),
      expect.objectContaining({ name: "John Doe 2" }),
    ]);
  });

  it("should not be able fetch characters of an inexistent user", async () => {
    await expect(() =>
      sut.handle({
        userDiscordId: "user-01",
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
