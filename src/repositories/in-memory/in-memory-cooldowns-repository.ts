import { Cooldown, Prisma, CooldownType } from "@prisma/client";
import { CooldownsRepository } from "../cooldowns-repository";
import { randomUUID } from "crypto";

export class InMemoryCooldownsRepository implements CooldownsRepository {
  public items: Cooldown[] = [];

  public async save(data: Cooldown) {
    const cooldownIndex = this.items.findIndex((item) => item.id === data.id);
    if (cooldownIndex >= 0) this.items[cooldownIndex] = data;

    return data;
  }

  public async create(data: Prisma.CooldownUncheckedCreateInput) {
    const cooldown = {
      id: data.id ?? Math.floor(Math.random() * 100),
      user_id: data.user_id,
      type: data.type,
      date: new Date(data.date),
    } satisfies Cooldown;

    this.items.push(cooldown);

    return cooldown;
  }

  public async findByTypeAndUserId(type: CooldownType, userId: string) {
    const cooldown = this.items.find(
      (item) => item.type === type && item.user_id === userId
    );
    return cooldown || null;
  }
}
