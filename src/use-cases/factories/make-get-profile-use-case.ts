import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetProfileUseCase } from "../get-profile";

export function makeGetProfileUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetProfileUseCase(usersRepository);

  return useCase;
}
