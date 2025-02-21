import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { InspectItemUseCase } from "../inspect-item";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";

export function makeInspectItemUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new InspectItemUseCase(usersRepository, itemsRepository);

  return useCase;
}
