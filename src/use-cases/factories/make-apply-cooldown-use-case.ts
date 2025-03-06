import { PrismaCooldownsRepository } from "@/repositories/prisma/prisma-cooldowns-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { ApplyCooldownUseCase } from "../apply-cooldown";

export function makeApplyCooldownUseCase() {
  const cooldownsRepository = new PrismaCooldownsRepository();
  const usersRepository = new PrismaUsersRepository();
  const useCase = new ApplyCooldownUseCase(
    cooldownsRepository,
    usersRepository
  );

  return useCase;
}
