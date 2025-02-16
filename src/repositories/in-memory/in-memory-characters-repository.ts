import { Prisma, Character } from "@prisma/client";
import { CharactersRepository } from "../characters-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCharactersRepository implements CharactersRepository {
  public items: Character[] = [];

  public async countCharactersByUserId(id: string) {
    const characterCount = this.items.filter(
      (item) => item.user_id === id
    ).length;
    return characterCount;
  }

  public async findByGuildAndUserId(userId: string, guildId: string) {
    const character = this.items.find(
      (item) => item.user_id === userId && item.guild_id === guildId
    );
    return character || null;
  }

  public async findManyByUserId(id: string) {
    const characters = this.items.filter((item) => item.user_id == id);
    return characters;
  }

  public async create(data: Prisma.CharacterUncheckedCreateInput) {
    const character = {
      id: data.id ?? randomUUID(),
      guild_id: data.guild_id,
      user_id: data.user_id,
      name: data.name,
      level: data.level ?? 1,
      xp: data.xp ?? 0,
      xp_cap: data.xp_cap ?? 1000,
      created_at: new Date(),
    } satisfies Character;

    this.items.push(character);

    return character;
  }
}
