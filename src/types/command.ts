import { Client, Message } from "discord.js";

export interface CommandOptions {
  name: string;
  category: string;
  aliases: string[];
  handle(params: CommandParams): unknown;
}

export interface CommandParams {
  client: Client<true>;
  message: Message<true>;
  args: string[];
}
