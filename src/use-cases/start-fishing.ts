import { FishingRepository } from "@/repositories/fishing-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { FishingData } from "@/types/fishing";
import { ItemsRepository } from "@/repositories/items-repository";
import { FishingSessionAlreadyExistsError } from "./errors/FishingSessionAlreadyExistsError";
import { ItemId } from "@/constants";

export interface StartFishingUseCaseRequest {
  userDiscordId: string;
  rod: ItemId;
  bait: ItemId;
}

export interface StartFishingUseCaseResponse {
  fishing: FishingData;
}

export class StartFishingUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private itemsRepository: ItemsRepository,
    private fishingRepository: FishingRepository
  ) {}

  public async handle({
    userDiscordId,
    rod,
    bait,
  }: StartFishingUseCaseRequest): Promise<StartFishingUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const userAlreadyIsFishing = await this.fishingRepository.findByDiscordId(
      userDiscordId
    );
    if (userAlreadyIsFishing) throw new FishingSessionAlreadyExistsError();

    const isValidRod = await this.itemsRepository.findByItemAndUserId(
      rod,
      user.id
    );
    const isValidBait = await this.itemsRepository.findByItemAndUserId(
      bait,
      user.id
    );

    if (!isValidBait || !isValidRod) throw new ResourceNotFoundError("item");

    const fishing = await this.fishingRepository.create({
      userDiscordId,
      tools: { rod, bait },
    });

    return { fishing };
  }
}
