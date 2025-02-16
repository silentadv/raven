import type { Character, Prisma } from "@prisma/client";

export interface CharactersRepository {
  findById(id: string): Promise<Character | null>;
  countCharactersByUserId(id: string): Promise<number>;
  findManyByUserId(id: string): Promise<Character[]>;
  findByGuildAndUserId(
    userId: string,
    guildId: string
  ): Promise<Character | null>;
  create(data: Prisma.CharacterUncheckedCreateInput): Promise<Character>;
  save(character: Character): Promise<Character>;
}
