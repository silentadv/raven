import type { Guild, Prisma } from "@prisma/client";

export interface GuildsRepository {
  findById(id: string): Promise<Guild | null>;
  findByDiscordId(id: string): Promise<Guild | null>;
  create(data: Prisma.GuildUncheckedCreateInput): Promise<Guild>;
}
