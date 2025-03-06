export interface FishingSession {
  messageId: string;
  userId: string;
  fishCount: number;
  startedAt: Date;
  fishAppearedAt: Date;
}
