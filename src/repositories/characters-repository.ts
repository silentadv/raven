import type { Character, Prisma } from "@prisma/client";

export interface CharactersRepository {
  countCharactersByUserId(id: string): Promise<number>;
  findManyByUserId(id: string): Promise<Character[]>;
  findByGuildAndUserId(
    userId: string,
    guildId: string
  ): Promise<Character | null>;
  create(data: Prisma.CharacterUncheckedCreateInput): Promise<Character>;
}
