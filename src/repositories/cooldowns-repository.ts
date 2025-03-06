import { Cooldown, CooldownType, Prisma } from "@prisma/client";

export interface CooldownsRepository {
  save(data: Cooldown): Promise<Cooldown>;
  create(data: Prisma.CooldownUncheckedCreateInput): Promise<Cooldown>;
  findByTypeAndUserId(
    type: CooldownType,
    userId: string
  ): Promise<Cooldown | null>;
}
