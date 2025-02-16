import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { UserAlreadyExistsError } from "./errors/UserAlreadyExistsError";

interface RegisterUseCaseRequest {
  userDiscordId: string;
}
interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  public constructor(private usersRepository: UsersRepository) {}

  public async handle({
    userDiscordId,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const userWithSameDiscordId = await this.usersRepository.findByDiscordId(
      userDiscordId
    );

    if (userWithSameDiscordId) throw new UserAlreadyExistsError();

    const user = await this.usersRepository.create({
      discord_id: userDiscordId,
    });

    return { user };
  }
}
