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

  public async create(data: FishingData) {
    const fishing = {
      userDiscordId: data.userDiscordId,
      tools: data.tools,
      fishSpawnedAt: data.fishSpawnedAt,
    } satisfies FishingData;
    this.items.push(fishing);

    return fishing;
  }

  public async save(data: FishingData) {
    const index = this.items.findIndex(
      (it) => it.userDiscordId === data.userDiscordId
    );
    if (index >= 0) this.items[index] = data;

    return data;
  }
}
