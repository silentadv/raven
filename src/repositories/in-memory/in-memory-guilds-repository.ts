import { Prisma, Guild } from "@prisma/client";
import { GuildsRepository } from "../guilds-repository";
import { randomUUID } from "node:crypto";

export class InMemoryGuildsRepository implements GuildsRepository {
  public items: Guild[] = [];

  public async create(data: Prisma.GuildUncheckedCreateInput) {
    const guild = {
      id: data.id ?? randomUUID(),
      discord_id: data.discord_id,
      name: data.name,
      created_at: new Date(),
    } satisfies Guild;

    this.items.push(guild);

    return guild;
  }
}
