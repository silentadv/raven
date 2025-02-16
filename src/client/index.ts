import { Client, Collection, GatewayIntentBits } from "discord.js";
import { env } from "../env";
import { commandHandler } from "../lib/utils/command-handler";
import { eventHandler } from "../lib/utils/event-handler";

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

commandHandler(client);
eventHandler(client);

client.login(env.CLIENT_TOKEN);
