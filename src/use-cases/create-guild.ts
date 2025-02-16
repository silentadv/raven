import { Guild, User } from "@prisma/client";
import { GuildsRepository } from "@/repositories/guilds-repository";

interface CreateGuildUseCaseRequest {
  guildDiscordId: string;
  guildName: string;
}
interface CreateGuildUseCaseResponse {
  guild: Guild;
}

export class CreateGuildUseCase {
  public constructor(private guildsRepository: GuildsRepository) {}

  public async handle({
    guildDiscordId,
    guildName,
  }: CreateGuildUseCaseRequest): Promise<CreateGuildUseCaseResponse> {
    const guildWithSameDiscordId = await this.guildsRepository.findByDiscordId(
      guildDiscordId
    );

    if (guildWithSameDiscordId) throw new Error();

    const guild = await this.guildsRepository.create({
      discord_id: guildDiscordId,
      name: guildName,
    });

    return { guild };
  }
}
