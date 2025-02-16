import type { Character, Prisma } from "@prisma/client";

export interface CharactersRepository {
  create(data: Prisma.CharacterUncheckedCreateInput): Promise<Character>;
}
