import { FishingRepository } from "@/repositories/fishing-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { FishingData } from "@/types/fishing";

export interface GetFishingUseCaseRequest {
  userDiscordId: string;
}

export interface GetFishingUseCaseResponse {
  fishing: FishingData;
}

export class GetFishingUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private fishingRepository: FishingRepository
  ) {}

  public async handle({
    userDiscordId,
  }: GetFishingUseCaseRequest): Promise<GetFishingUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const fishing = await this.fishingRepository.findByDiscordId(userDiscordId);
    if (!fishing) throw new ResourceNotFoundError("fishing");

    return { fishing };
  }
}
