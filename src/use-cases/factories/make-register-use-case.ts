import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetProfileUseCase } from "../get-profile";
import { RegisterUseCase } from "../register";

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new RegisterUseCase(usersRepository);

  return useCase;
}
