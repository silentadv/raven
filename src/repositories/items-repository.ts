import { Item, Prisma } from "@prisma/client";

export interface ItemsRepository {
  findByItemAndUserId(
    itemId: string,
    userDiscordId: string
  ): Promise<Item | null>;
  save(item: Item): Promise<Item>;
  create(item: Prisma.ItemUncheckedCreateInput): Promise<Item>;
}
