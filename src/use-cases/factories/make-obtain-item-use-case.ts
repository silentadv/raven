import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ObtainItemUseCase } from "../obtain-item";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";

export function makeObtainItemUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new ObtainItemUseCase(usersRepository, itemsRepository);

  return useCase;
}
