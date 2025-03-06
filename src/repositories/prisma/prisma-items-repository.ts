import { Item, Prisma } from "@prisma/client";
import { ItemsRepository } from "../items-repository";
import { prisma } from "@/lib/prisma";

export class PrismaItemsRepository implements ItemsRepository {
  public async findByItemAndUserId(itemId: string, userId: string) {
    const item = await prisma.item.findFirst({
      where: {
        item_id: itemId,
        user_id: userId,
      },
    });

    return item;
  }

  public async findManyByOwnerId(ownerId: string) {
    const items = await prisma.item.findMany({
      where: {
        user_id: ownerId,
      },
    });

    return items;
  }

  public async save(item: Item) {
    const updatedItem = await prisma.item.update({
      where: {
        id: item.id,
      },
      data: item,
    });

    return updatedItem;
  }

  public async create(item: Prisma.ItemUncheckedCreateInput) {
    const createdItem = await prisma.item.create({
      data: item,
    });

    return createdItem;
  }
}
