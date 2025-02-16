import { UsersRepository } from "@/repositories/users-repository";
import { Character } from "@prisma/client";
import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface FetchUserCharactersUseCaseRequest {
  userDiscordId: string;
}
interface FetchUserCharactersUseCaseResponse {
  characters: Character[];
}

export class FetchUserCharactersUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private charactersRepository: CharactersRepository
  ) {}

  public async handle({
    userDiscordId,
  }: FetchUserCharactersUseCaseRequest): Promise<FetchUserCharactersUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("discord user");

    const characters = await this.charactersRepository.findManyByUserId(
      user.id
    );

    return { characters };
  }
}
