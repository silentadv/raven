import { UsersRepository } from "@/repositories/users-repository";
import { Character } from "@prisma/client";
import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "../errors/ResourceNotFoundError";

interface CreateCharacterUseCaseRequest {
  userDiscordId: string;
  characterServerId: string;
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
    characterServerId,
    characterName,
  }: CreateCharacterUseCaseRequest): Promise<CreateCharacterUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("discord user");

    const character = await this.charactersRepository.create({
      user_id: user.id,
      server_id: characterServerId,
      name: characterName,
    });

    return { character };
  }
}
