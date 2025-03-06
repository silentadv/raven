import { ItemsRepository } from "@/repositories/items-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { Item } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

export interface FetchItemsUseCaseRequest {
  userDiscordId: string;
}

export interface FetchItemsUseCaseResponse {
  items: Item[];
}

export class FetchItemsUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private itemsRepository: ItemsRepository
  ) {}

  public async handle({
    userDiscordId,
  }: FetchItemsUseCaseRequest): Promise<FetchItemsUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const items = await this.itemsRepository.findManyByOwnerId(user.id);
    return { items };
  }
}
