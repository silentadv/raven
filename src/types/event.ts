import { Client, ClientEvents } from "discord.js";

export interface EventOptions<T extends keyof ClientEvents> {
  name: T;
  once?: boolean;
  handle(client: Client, ...params: ClientEvents[T]): unknown;
}
