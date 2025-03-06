import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";
import { DecrementItemUseCase } from "../decrement-item";

export function makeDecrementItemUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new DecrementItemUseCase(itemsRepository, usersRepository);

  return useCase;
}
