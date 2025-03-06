import { CommandOptions } from "@/types/command";
import { Client } from "discord.js";
import glob from "tiny-glob";

export async function handleCommands(client: Client) {
  const files = await glob("src/client/commands/**/*.ts");

  for (const file of files) {
    const { default: command }: { default: CommandOptions } = await import(
      file
    );

    client.commands.set(command.name, command);

    console.log(`✅ Command ${command.name} loaded.`);
  }
}
