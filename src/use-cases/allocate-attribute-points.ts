import { UsersRepository } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InvalidAttributePointsAllocation } from "./errors/InvalidAttributePointsAllocation";
import { User } from "@prisma/client";

interface AllocateAttributePointsUseCaseRequest {
  userDiscordId: string;
  strength?: number;
  agility?: number;
  magic?: number;
  resistance?: number;
}

interface AllocateAttributePointsUseCaseResponse {
  user: User;
}

export class AllocateAttributePointsUseCase {
  public constructor(private usersRepository: UsersRepository) {}

  public async handle({
    userDiscordId,
    strength = 0,
    agility = 0,
    magic = 0,
    resistance = 0,
  }: AllocateAttributePointsUseCaseRequest): Promise<AllocateAttributePointsUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const totalAllocatedPoints = strength + agility + magic + resistance;
    if (totalAllocatedPoints > user.points)
      throw new InvalidAttributePointsAllocation();
    if (
      totalAllocatedPoints <= 0 ||
      strength < 0 ||
      agility < 0 ||
      magic < 0 ||
      resistance < 0
    )
      throw new InvalidAttributePointsAllocation();

    user.strength += strength;
    user.agility += agility;
    user.magic += magic;
    user.resistance += resistance;
    user.points -= totalAllocatedPoints;

    await this.usersRepository.save(user);

    return { user };
  }
}
