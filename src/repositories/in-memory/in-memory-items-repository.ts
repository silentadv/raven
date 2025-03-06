import { Item, Prisma } from "@prisma/client";
import { ItemsRepository } from "../items-repository";

export class InMemoryItemsRepository implements ItemsRepository {
  public items: Item[] = [];

  public async findByItemAndUserId(itemId: string, userId: string) {
    const item = this.items.find(
      (item) => item.item_id === itemId && item.user_id === userId
    );
    return item || null;
  }

  public async findManyByOwnerId(ownerId: string) {
    const items = this.items.filter((item) => item.user_id === ownerId);
    return items;
  }

  public async save(item: Item) {
    const itemIndex = this.items.findIndex((it) => it.id === item.id);
    if (itemIndex >= 0) this.items[itemIndex] = item;
    return item;
  }

  public async create(item: Prisma.ItemUncheckedCreateInput) {
    const it = {
      id: item.id ?? Math.floor(Math.random() * 100),
      user_id: item.user_id,
      count: item.count ?? 0,
      item_id: item.item_id,
      type: item.type,
    } satisfies Item;

    this.items.push(it);

    return it;
  }
}
