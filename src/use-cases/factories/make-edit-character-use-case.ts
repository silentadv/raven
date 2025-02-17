import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { EditCharacterUseCase } from "../edit-character";

export function makeEditCharactetUseCase() {
  const charactersRepository = new PrismaCharactersRepository();
  const useCase = new EditCharacterUseCase(charactersRepository);

  return useCase;
}
