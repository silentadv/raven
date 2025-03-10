import { FishingRepository } from "@/repositories/fishing-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { FishingData } from "@/types/fishing";

export interface ObtainFishingDropUseCaseRequest {
  userDiscordId: string;
  dropId: string;
  count?: number;
}

export interface ObtainFishingDropUseCaseResponse {
  fishing: FishingData;
}

export class ObtainFishingDropUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private fishingRepository: FishingRepository
  ) {}

  public async handle({
    userDiscordId,
    dropId,
    count = 1,
  }: ObtainFishingDropUseCaseRequest): Promise<ObtainFishingDropUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const fishing = await this.fishingRepository.findByDiscordId(userDiscordId);
    if (!fishing) throw new ResourceNotFoundError("fishing");

    fishing.drops ??= [];

    const alreadyExistsDrop = fishing.drops.find((d) => d.id === dropId);

    if (alreadyExistsDrop) alreadyExistsDrop.count += count;
    else fishing.drops.push({ id: dropId, count });

    await this.fishingRepository.save(fishing);

    return { fishing };
  }
}
