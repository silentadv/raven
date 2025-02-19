import { CooldownsRepository } from "@/repositories/cooldowns-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { Cooldown, CooldownType } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface ApplyCooldownUseCaseRequest {
  userDiscordId: string;
  cooldownType: CooldownType;
  cooldownDate: Date;
}

interface ApplyCooldownUseCaseResponse {
  cooldown: Cooldown;
}

export class ApplyCooldownUseCase {
  public constructor(
    private cooldownsRepository: CooldownsRepository,
    private usersRepository: UsersRepository
  ) {}
  public async handle({
    userDiscordId,
    cooldownDate,
    cooldownType,
  }: ApplyCooldownUseCaseRequest): Promise<ApplyCooldownUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const cooldownAlreadyExists =
      await this.cooldownsRepository.findByTypeAndUserId(cooldownType, user.id);
    if (cooldownAlreadyExists) {
      cooldownAlreadyExists.date = cooldownDate;
      await this.cooldownsRepository.save(cooldownAlreadyExists);
      return { cooldown: cooldownAlreadyExists };
    }

    const cooldown = await this.cooldownsRepository.create({
      user_id: user.id,
      type: cooldownType,
      date: cooldownDate,
    });

    return { cooldown };
  }
}
