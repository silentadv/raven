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

  public async findById(id: string) {
    const character = this.items.find((item) => item.id === id);
    return character || null;
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

  public async save(character: Character) {
    const characterIndex = this.items.findIndex(
      (item) => item.id == character.id
    );

    if (characterIndex) this.items[characterIndex] = character;

    return character;
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
      points: data.points ?? 10,
      hp: data.hp ?? 100,
      strength: data.strength ?? 1,
      magic: data.magic ?? 1,
      agility: data.agility ?? 1,
      resistance: data.resistance ?? 1,
      created_at: new Date(),
    } satisfies Character;

    this.items.push(character);

    return character;
  }
}
