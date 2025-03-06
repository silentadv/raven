import { CooldownsRepository } from "@/repositories/cooldowns-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { Cooldown, CooldownType } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface GetCooldownUseCaseRequest {
  userDiscordId: string;
  cooldownType: CooldownType;
}

interface GetCooldownUseCaseResponse {
  cooldown: Cooldown | null;
}

export class GetCooldownUseCase {
  public constructor(
    private cooldownsRepository: CooldownsRepository,
    private usersRepository: UsersRepository
  ) {}
  public async handle({
    userDiscordId,
    cooldownType,
  }: GetCooldownUseCaseRequest): Promise<GetCooldownUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const cooldown = await this.cooldownsRepository.findByTypeAndUserId(
      cooldownType,
      user.id
    );
    return { cooldown };
  }
}
