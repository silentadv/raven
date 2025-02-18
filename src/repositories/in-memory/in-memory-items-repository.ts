import { Item, Prisma } from "@prisma/client";
import { ItemsRepository } from "../items-repository";
import { randomUUID } from "crypto";

export class InMemoryItemsRepository implements ItemsRepository {
  public items: Item[] = [];

  public async findByItemIdAndCharacterId(itemId: string, characterId: string) {
    const item = this.items.find(
      (item) => item.item_id === itemId && item.character_id === characterId
    );
    return item || null;
  }

  public async save(item: Item) {
    const itemIndex = this.items.findIndex((it) => it.id === item.id);
    if (itemIndex >= 0) this.items[itemIndex] = item;
    return item;
  }

  public async create(item: Prisma.ItemUncheckedCreateInput) {
    const it = {
      id: item.id ?? randomUUID(),
      character_id: item.character_id,
      count: item.count ?? 0,
      item_id: item.item_id,
    } satisfies Item;

    this.items.push(it);

    return it;
  }
}
