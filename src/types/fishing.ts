import { ItemId } from "@/constants";

export interface FishingData {
  userDiscordId: string;
  tools: FishingTools;
  fishSpawnedAt?: Date;
  drops?: FishingDrop[];
}

export interface FishingDrop {
  id: string;
  count: number;
}

export interface FishingTools {
  rod: ItemId;
  bait: ItemId;
}
