import { CommandOptions } from "@/types/command";
import { Client } from "discord.js";
import glob from "tiny-glob";

export async function handleComponents(client: Client) {
  const files = await glob("src/client/components/**/*.ts");

  for (const file of files) {
    const { default: component }: { default: CommandOptions } = await import(
      file
    );

    client.components.set(component.name, component);

    console.log(`✅ Component ${component.name} loaded.`);
  }
}
