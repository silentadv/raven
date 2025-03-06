import { ClientEvents } from "discord.js";
import { EventOptions } from "@/types/event";

export function makeEvent<T extends keyof ClientEvents>(
  options: EventOptions<T>
) {
  return options;
}
