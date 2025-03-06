import { ItemId } from "@/constants";
import { ItemsRepository } from "@/repositories/items-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { Item } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

export interface DecrementItemUseCaseRequest {
  itemId: ItemId;
  itemCount: number;
  userDiscordId: string;
}

export interface DecrementItemUseCaseResponse {
  item: Item;
}

export class DecrementItemUseCase {
  public constructor(
    private itemsRepository: ItemsRepository,
    private usersRepository: UsersRepository
  ) {}

  public async handle({
    itemId,
    itemCount,
    userDiscordId,
  }: DecrementItemUseCaseRequest): Promise<DecrementItemUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const item = await this.itemsRepository.findByItemAndUserId(
      itemId,
      user.id
    );
    if (!item) throw new ResourceNotFoundError("item");

    item.count -= Math.abs(itemCount);
    await this.itemsRepository.save(item);

    return { item };
  }
}
