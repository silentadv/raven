import { UsersRepository } from "@/repositories/users-repository";
import { Character } from "@prisma/client";
import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { GuildsRepository } from "@/repositories/guilds-repository";

interface GetGuildCharacterProfileUseCaseRequest {
  userDiscordId: string;
  guildDiscordId: string;
}
interface GetGuildCharacterProfileUseCaseResponse {
  character: Character;
}

export class GetGuildCharacterProfileUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private charactersRepository: CharactersRepository,
    private guildsRepository: GuildsRepository
  ) {}

  public async handle({
    userDiscordId,
    guildDiscordId,
  }: GetGuildCharacterProfileUseCaseRequest): Promise<GetGuildCharacterProfileUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const guild = await this.guildsRepository.findByDiscordId(guildDiscordId);
    if (!guild) throw new ResourceNotFoundError("guild");

    const character = await this.charactersRepository.findByGuildAndUserId(
      user.id,
      guild.id
    );
    if (!character) throw new ResourceNotFoundError("character");

    return { character };
  }
}
