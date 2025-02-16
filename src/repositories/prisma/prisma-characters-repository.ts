import { Character, Prisma } from "@prisma/client";
import { CharactersRepository } from "../characters-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCharactersRepository implements CharactersRepository {
  public async findById(id: string) {
    const character = await prisma.character.findUnique({
      where: {
        id,
      },
    });

    return character;
  }

  public async countCharactersByUserId(id: string) {
    const userCharacterCount = await prisma.character.count({
      where: {
        user_id: id,
      },
    });

    return userCharacterCount;
  }

  public async findManyByUserId(id: string) {
    const characters = await prisma.character.findMany({
      where: {
        user_id: id,
      },
    });

    return characters;
  }

  public async findByGuildAndUserId(userId: string, guildId: string) {
    const character = await prisma.character.findFirst({
      where: {
        user_id: userId,
        guild_id: guildId,
      },
    });

    return character;
  }

  public async create(data: Prisma.CharacterUncheckedCreateInput) {
    const character = await prisma.character.create({
      data,
    });

    return character;
  }

  public async save(character: Character) {
    await prisma.character.update({
      where: {
        id: character.id,
      },
      data: character,
    });

    return character;
  }
}
