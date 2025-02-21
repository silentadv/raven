import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { AllocateAttributePointsUseCase } from "../allocate-attribute-points";

export function makeAllocateAttributePointsUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new AllocateAttributePointsUseCase(usersRepository);

  return useCase;
}
