import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { ItemsRepository } from "@/repositories/items-repository";
import { Item } from "@prisma/client";

interface CharacterObtainItemUseCaseRequest {
  characterId: string;
  itemCount: number;
  itemId: string;
}

interface CharacterObtainItemUseCaseResponse {
  item: Item;
}

export class CharacterObtainItemUseCase {
  public constructor(
    private charactersRepository: CharactersRepository,
    private itemsRepository: ItemsRepository
  ) {}

  public async handle({
    characterId,
    itemCount,
    itemId,
  }: CharacterObtainItemUseCaseRequest): Promise<CharacterObtainItemUseCaseResponse> {
    const existsCharacter = await this.charactersRepository.findById(
      characterId
    );
    if (!existsCharacter) throw new ResourceNotFoundError("character");

    const existsItem = await this.itemsRepository.findByItemIdAndCharacterId(
      itemId,
      characterId
    );
    if (existsItem) {
      existsItem.count += itemCount;
      const updatedItem = await this.itemsRepository.save(existsItem);
      return { item: updatedItem };
    }

    const createdItem = await this.itemsRepository.create({
      item_id: itemId,
      character_id: characterId,
      count: itemCount,
    });

    return { item: createdItem };
  }
}
