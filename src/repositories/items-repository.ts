import { Item, Prisma } from "@prisma/client";

export interface ItemsRepository {
  findByItemIdAndCharacterId(
    itemId: string,
    characterId: string
  ): Promise<Item | null>;
  save(item: Item): Promise<Item>;
  create(item: Prisma.ItemUncheckedCreateInput): Promise<Item>;
}
