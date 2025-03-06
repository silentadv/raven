import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";
import { StartFishingUseCase } from "../start-fishing";
import { ClientFishingRepository } from "@/client/repositories";

export function makeStartFishingUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new StartFishingUseCase(
    usersRepository,
    itemsRepository,
    ClientFishingRepository
  );

  return useCase;
}
