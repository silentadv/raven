import { CharactersRepository } from "@/repositories/characters-repository";
import { Character } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface EditCharacterUseCaseRequest {
  characterId: string;
  character: Omit<Partial<Character>, "id">;
}
interface EditCharacterUseCaseResponse {
  character: Character;
}

export class EditCharacterUseCase {
  public constructor(private charactersRepository: CharactersRepository) {}

  public async handle({
    characterId,
    character,
  }: EditCharacterUseCaseRequest): Promise<EditCharacterUseCaseResponse> {
    const existsCharacter = await this.charactersRepository.findById(
      characterId
    );
    if (!existsCharacter) throw new ResourceNotFoundError("character");

    const updatedCharacter = await this.charactersRepository.save({
      ...existsCharacter,
      ...character,
    });
    return { character: updatedCharacter };
  }
}
