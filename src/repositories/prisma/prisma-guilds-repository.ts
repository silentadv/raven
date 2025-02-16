import { Guild, Prisma } from "@prisma/client";
import { GuildsRepository } from "../guilds-repository";
import { prisma } from "@/lib/prisma";

export class PrismaGuildsRepository implements GuildsRepository {
  public async findByDiscordId(id: string) {
    const guild = await prisma.guild.findUnique({
      where: {
        discord_id: id,
      },
    });

    return guild;
  }

  public async create(data: Prisma.GuildUncheckedCreateInput) {
    const guild = await prisma.guild.create({
      data,
    });

    return guild;
  }
}
