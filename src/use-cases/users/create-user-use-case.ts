import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { UserAlreadyExistsError } from "../errors/UserAlreadyExistsError";

interface CreateUserUseCaseRequest {
  userDiscordId: string;
  userCharacterName: string;
}
interface CreateUserUseCaseResponse {
  user: User;
}

export class CreateUserUseCase {
  public constructor(private usersRepository: UsersRepository) {}

  public async handle({
    userDiscordId,
    userCharacterName,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameDiscordId = await this.usersRepository.findByDiscordId(
      userDiscordId
    );

    if (userWithSameDiscordId) throw new UserAlreadyExistsError();

    const user = await this.usersRepository.create({
      discord_id: userDiscordId,
      character_name: userCharacterName,
    });

    return { user };
  }
}
