import { PrismaCooldownsRepository } from "@/repositories/prisma/prisma-cooldowns-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetCooldownUseCase } from "../get-cooldown";

export function makeGetCooldownUseCase() {
  const cooldownsRepository = new PrismaCooldownsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetCooldownUseCase(cooldownsRepository, usersRepository);

  return useCase;
}
