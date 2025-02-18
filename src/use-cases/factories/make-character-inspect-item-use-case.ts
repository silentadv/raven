import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { CharacterInspectItemUseCase } from "../character-inspect-item";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";

export function makeCharacterInspectItemUseCase() {
  const charactersRepository = new PrismaCharactersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new CharacterInspectItemUseCase(
    charactersRepository,
    itemsRepository
  );

  return useCase;
}
