import { UsersRepository } from "@/repositories/users-repository";
import { Character } from "@prisma/client";
import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

interface CreateCharacterUseCaseRequest {
  userDiscordId: string;
  characterGuildId: string;
  characterName: string;
}
interface CreateCharacterUseCaseResponse {
  character: Character;
}

export class CreateCharacterUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private charactersRepository: CharactersRepository
  ) {}

  public async handle({
    userDiscordId,
    characterGuildId,
    characterName,
  }: CreateCharacterUseCaseRequest): Promise<CreateCharacterUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("discord user");

    const character = await this.charactersRepository.create({
      user_id: user.id,
      guild_id: characterGuildId,
      name: characterName,
    });

    return { character };
  }
}
