import { FishingData } from "@/types/fishing";

export interface FishingRepository {
  findByDiscordId(userDiscordId: string): Promise<FishingData | null>;
  create(data: Omit<FishingData, "fishCount">): Promise<FishingData>;
}
