import { UsersRepository } from "@/repositories/users-repository";
import { Character } from "@prisma/client";
import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { GuildsRepository } from "@/repositories/guilds-repository";
import { MaxUserCharacterCountError } from "./errors/MaxUserCharacterCountError";

const MAX_USER_CHARACTER_COUNT = 5;

interface CreateCharacterUseCaseRequest {
  userDiscordId: string;
  characterGuildDiscordId: string;
  characterName: string;
}
interface CreateCharacterUseCaseResponse {
  character: Character;
}

export class CreateCharacterUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private charactersRepository: CharactersRepository,
    private guildsRepository: GuildsRepository
  ) {}

  public async handle({
    userDiscordId,
    characterGuildDiscordId,
    characterName,
  }: CreateCharacterUseCaseRequest): Promise<CreateCharacterUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const userCharacterCount =
      await this.charactersRepository.countCharactersByUserId(user.id);
    if (userCharacterCount >= MAX_USER_CHARACTER_COUNT)
      throw new MaxUserCharacterCountError("user");

    const guild = await this.guildsRepository.findByDiscordId(
      characterGuildDiscordId
    );
    if (!guild) throw new ResourceNotFoundError("guild");

    const userAlreadyHasOneCharacterInThisGuild =
      await this.charactersRepository.findByGuildAndUserId(user.id, guild.id);
    if (userAlreadyHasOneCharacterInThisGuild)
      throw new MaxUserCharacterCountError("guild");

    const character = await this.charactersRepository.create({
      user_id: user.id,
      guild_id: guild.id,
      name: characterName,
    });

    return { character };
  }
}
