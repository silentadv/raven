import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { FetchUserCharactersUseCase } from "../fetch-user-characters";

export function makeFetchUserCharactersUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const charactersRepository = new PrismaCharactersRepository();
  const useCase = new FetchUserCharactersUseCase(
    usersRepository,
    charactersRepository
  );

  return useCase;
}
