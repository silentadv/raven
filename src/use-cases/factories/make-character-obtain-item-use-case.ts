import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";
import { CharacterObtainItemUseCase } from "../character-obtain-item";

export function makeCharacterObtainItemUseCase() {
  const charactersRepository = new PrismaCharactersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new CharacterObtainItemUseCase(
    charactersRepository,
    itemsRepository
  );

  return useCase;
}
