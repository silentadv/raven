import { Client, Message } from "discord.js";

export interface CommandOptions<TParsedArgs = string[]> {
  name: string;
  category: string;
  aliases: string[];
  parse?: (args: string[]) => TParsedArgs;
  handle(params: CommandParams<TParsedArgs>): unknown;
}

export interface CommandParams<TArgs = string[]> {
  client: Client<true>;
  message: Message<true>;
  args: TArgs;
}
