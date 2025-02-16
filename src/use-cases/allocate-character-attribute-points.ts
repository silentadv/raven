import { UsersRepository } from "@/repositories/users-repository";
import { Character } from "@prisma/client";
import { CharactersRepository } from "@/repositories/characters-repository";
import { ResourceNotFoundError } from "./errors/ResourceNotFoundError";
import { InvalidAttributePointsAllocation } from "./errors/InvalidAttributePointsAllocation";

interface AllocateCharacterAttributePointsUseCaseRequest {
  userDiscordId: string;
  userCharacterId: string;
  strength?: number;
  agility?: number;
  magic?: number;
  resistance?: number;
}

interface AllocateCharacterAttributePointsUseCaseResponse {
  character: Character;
}

export class AllocateCharacterAttributePointsUseCase {
  public constructor(
    private usersRepository: UsersRepository,
    private charactersRepository: CharactersRepository
  ) {}

  public async handle({
    userDiscordId,
    userCharacterId,
    strength = 0,
    agility = 0,
    magic = 0,
    resistance = 0,
  }: AllocateCharacterAttributePointsUseCaseRequest): Promise<AllocateCharacterAttributePointsUseCaseResponse> {
    const user = await this.usersRepository.findByDiscordId(userDiscordId);
    if (!user) throw new ResourceNotFoundError("user");

    const character = await this.charactersRepository.findById(userCharacterId);
    if (!character || character.user_id !== user.id)
      throw new ResourceNotFoundError("character");

    const totalAllocatedPoints = strength + agility + magic + resistance;
    if (totalAllocatedPoints > character.points)
      throw new InvalidAttributePointsAllocation();
    if (totalAllocatedPoints <= 0) throw new InvalidAttributePointsAllocation();

    character.strength += strength;
    character.agility += agility;
    character.magic += magic;
    character.resistance += resistance;
    character.points -= totalAllocatedPoints;

    await this.charactersRepository.save(character);

    return { character };
  }
}
