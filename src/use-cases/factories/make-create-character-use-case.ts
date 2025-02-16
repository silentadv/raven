import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { CreateCharacterUseCase } from "../create-character";

export function makeCreateCharacterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const guildsRepository = new PrismaGuildsRepository();
  const charactersRepository = new PrismaCharactersRepository();
  const useCase = new CreateCharacterUseCase(
    usersRepository,
    charactersRepository,
    guildsRepository
  );

  return useCase;
}
