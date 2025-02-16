import type { Guild, Prisma } from "@prisma/client";

export interface GuildsRepository {
  findByDiscordId(id: string): Promise<Guild | null>;
  create(data: Prisma.GuildUncheckedCreateInput): Promise<Guild>;
}
