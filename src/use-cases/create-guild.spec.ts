import { describe, it, beforeEach, expect } from "vitest";
import { InMemoryGuildsRepository } from "@/repositories/in-memory/in-memory-guilds-repository";
import { CreateGuildUseCase } from "./create-guild";
import { GuildAlreadyExistsError } from "./errors/GuildAlreadyExistsError";

let guildsRepository: InMemoryGuildsRepository;
let sut: CreateGuildUseCase;

describe("Create Guild Use Case", () => {
  beforeEach(() => {
    guildsRepository = new InMemoryGuildsRepository();
    sut = new CreateGuildUseCase(guildsRepository);
  });

  it("should be able to create an guild.", async () => {
    const { guild } = await sut.handle({
      guildDiscordId: "guild-01",
      guildName: "Typescript Guild",
    });

    expect(guild.id).toEqual(expect.any(String));
  });

  it("should not be able to create an guild with same discord id.", async () => {
    await sut.handle({
      guildDiscordId: "guild-01",
      guildName: "Typescript Guild 1",
    });

    await expect(() =>
      sut.handle({
        guildDiscordId: "guild-01",
        guildName: "Typescript Guild 2",
      })
    ).rejects.toBeInstanceOf(GuildAlreadyExistsError);
  });
});
