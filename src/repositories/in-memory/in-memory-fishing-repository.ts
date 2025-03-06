import { FishingData } from "@/types/fishing";
import { FishingRepository } from "../fishing-repository";

export class InMemoryFishingRepository implements FishingRepository {
  public items: FishingData[] = [];

  public async findByDiscordId(userDiscordId: string) {
    const fishing = this.items.find(
      (item) => item.userDiscordId === userDiscordId
    );
    return fishing || null;
  }

  public async create(data: Omit<FishingData, "fishCount">) {
    const fishing = {
      userDiscordId: data.userDiscordId,
      tools: data.tools,
      fishCount: 0,
      fishSpawnedAt: data.fishSpawnedAt,
    } satisfies FishingData;
    this.items.push(fishing);

    return fishing;
  }
}
