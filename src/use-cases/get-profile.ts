import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";

interface GetProfileUseCaseRequest {
  userDiscordId: string;
}
interface GetProfileUseCaseResponse {
  user: User;
}

export class GetProfileUseCase {
  public constructor(private usersRepository: UsersRepository) {}

  public async handle({
    userDiscordId,
  }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    return { user };
  }
}
