import { Prisma, Character } from "@prisma/client";
import { CharactersRepository } from "../characters-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCharactersRepository implements CharactersRepository {
  public items: Character[] = [];

  public async create(data: Prisma.CharacterUncheckedCreateInput) {
    const character = {
      id: data.id ?? randomUUID(),
      server_id: data.server_id,
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
