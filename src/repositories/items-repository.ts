import { Item, Prisma } from "@prisma/client";

export interface ItemsRepository {
  findByItemAndUserId(itemId: string, userId: string): Promise<Item | null>;
  findManyByOwnerId(ownerId: string): Promise<Item[]>;
  save(item: Item): Promise<Item>;
  create(item: Prisma.ItemUncheckedCreateInput): Promise<Item>;
}
