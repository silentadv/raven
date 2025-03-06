import { Cooldown, Prisma, CooldownType } from "@prisma/client";
import { CooldownsRepository } from "../cooldowns-repository";
import { prisma } from "@/lib/prisma";

export class PrismaCooldownsRepository implements CooldownsRepository {
  public async save(data: Cooldown) {
    const updatedCooldown = await prisma.cooldown.update({
      where: {
        id: data.id,
      },
      data,
    });

    return updatedCooldown;
  }

  public async create(data: Prisma.CooldownUncheckedCreateInput) {
    const cooldown = await prisma.cooldown.create({
      data,
    });

    return cooldown;
  }

  public async findByTypeAndUserId(type: CooldownType, userId: string) {
    const cooldown = await prisma.cooldown.findFirst({
      where: {
        user_id: userId,
        type,
      },
    });

    return cooldown;
  }
}
