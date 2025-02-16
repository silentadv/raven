import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { CreateGuildUseCase } from "../create-guild";

export function makeCreateGuildUseCase() {
  const guildsRepository = new PrismaGuildsRepository();
  const useCase = new CreateGuildUseCase(guildsRepository);

  return useCase;
}
