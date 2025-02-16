import { Guild, Prisma } from "@prisma/client";

export interface GuildsRepository {
  create(data: Prisma.GuildUncheckedCreateInput): Promise<Guild>;
}
