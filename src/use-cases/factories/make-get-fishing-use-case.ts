import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetFishingUseCase } from "../get-fishing";
import { ClientFishingRepository } from "@/client/repositories";

export function makeGetFishingUseCase() {
  const usersRepository = new PrismaUsersRepository();
  const useCase = new GetFishingUseCase(
    usersRepository,
    ClientFishingRepository
  );

  return useCase;
}
