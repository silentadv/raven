import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { ItemsRepository } from "@/repositories/items-repository";
import { Item, ItemType } from "@prisma/client";

interface ObtainItemUseCaseRequest {
  userDiscordId: string;
  itemType: ItemType;
  itemCount: number;
  itemId: string;
}

interface ObtainItemUseCaseResponse {
  item: Item;
}

export class ObtainItemUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private itemsRepository: ItemsRepository
  ) {}

  public async handle({
    userDiscordId,
    itemCount,
    itemType,
    itemId,
  }: ObtainItemUseCaseRequest): Promise<ObtainItemUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const existsItem = await this.itemsRepository.findByItemAndUserId(
      itemId,
      user.id
    );
    if (existsItem) {
      existsItem.count += itemCount;
      const updatedItem = await this.itemsRepository.save(existsItem);
      return { item: updatedItem };
    }

    const createdItem = await this.itemsRepository.create({
      item_id: itemId,
      user_id: user.id,
      count: itemCount,
      type: itemType,
    });

    return { item: createdItem };
  }
}
