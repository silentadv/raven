import { EventOptions } from "@/types/event";
import { Client } from "discord.js";
import glob from "tiny-glob";

export async function eventHandler(client: Client) {
  const files = await glob("src/events/**/*.ts");

  for (const file of files) {
    const { default: event }: { default: EventOptions<any> } = await import(
      file
    );

    client[event.once ? "once" : "on"](event.name, (...args) =>
      event.handle(client, ...args)
    );

    console.log(`✅ Event ${event.name} loaded.`);
  }
}
