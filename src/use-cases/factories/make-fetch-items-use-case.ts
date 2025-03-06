import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { PrismaItemsRepository } from "@/repositories/prisma/prisma-items-repository";
import { FetchItemsUseCase } from "../fetch-items";

export function makeFetchItemsUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const itemsRepository = new PrismaItemsRepository();
  const useCase = new FetchItemsUseCase(usersRepository, itemsRepository);

  return useCase;
}
