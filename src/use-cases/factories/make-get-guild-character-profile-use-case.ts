import { PrismaCharactersRepository } from "@/repositories/prisma/prisma-characters-repository";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetGuildCharacterProfileUseCase } from "../get-guild-character-profile";

export function makeGetGuildCharacterProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const guildsRepository = new PrismaGuildsRepository();
  const charactersRepository = new PrismaCharactersRepository();
  const useCase = new GetGuildCharacterProfileUseCase(
    usersRepository,
    charactersRepository,
    guildsRepository
  );

  return useCase;
}
