import { ItemId } from "@/constants";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { ItemsRepository } from "@/repositories/items-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { Item } from "@prisma/client";

interface InspectItemUseCaseRequest {
  userDiscordId: string;
  itemId: ItemId;
}

interface InspectItemUseCaseResponse {
  item: Item | null;
}

export class InspectItemUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private itemsRepository: ItemsRepository
  ) {}

  public async handle({
    userDiscordId,
    itemId,
  }: InspectItemUseCaseRequest): Promise<InspectItemUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const item = await this.itemsRepository.findByItemAndUserId(
      itemId,
      user.id
    );

    return { item };
  }
}
