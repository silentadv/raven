import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { ItemsRepository } from "@/repositories/items-repository";
import { Item } from "@prisma/client";

interface CharacterInspectItemUseCaseRequest {
  characterId: string;
  itemId: string;
}

interface CharacterInspectItemUseCaseResponse {
  item: Item;
}

export class CharacterInspectItemUseCase {
  public constructor(
    private charactersRepository: CharactersRepository,
    private itemsRepository: ItemsRepository
  ) {}

  public async handle({
    characterId,
    itemId,
  }: CharacterInspectItemUseCaseRequest): Promise<CharacterInspectItemUseCaseResponse> {
    const existsCharacter = await this.charactersRepository.findById(
      characterId
    );
    if (!existsCharacter) throw new ResourceNotFoundError("character");

    const item = await this.itemsRepository.findByItemIdAndCharacterId(
      itemId,
      characterId
    );
    if (!item) throw new ResourceNotFoundError("item");

    return { item };
  }
}
