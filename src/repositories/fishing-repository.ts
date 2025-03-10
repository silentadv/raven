import { FishingData } from "@/types/fishing";

export interface FishingRepository {
  findByDiscordId(userDiscordId: string): Promise<FishingData | null>;
  create(data: FishingData): Promise<FishingData>;
  save(data: FishingData): Promise<FishingData>;
}
