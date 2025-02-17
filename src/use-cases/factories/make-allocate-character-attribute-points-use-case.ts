import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AllocateCharacterAttributePointsUseCase } from "../allocate-character-attribute-points";

export function makeAllocateCharacterAttributePointsUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const charactersRepository = new PrismaCharactersRepository();
  const useCase = new AllocateCharacterAttributePointsUseCase(
    usersRepository,
    charactersRepository
  );

  return useCase;
}
