export interface FishingData {
  userDiscordId: string;
  tools: FishingTools;
  fishCount: number;
  fishSpawnedAt?: Date;
}

export interface FishingTools {
  rod: string;
  bait: string;
}
