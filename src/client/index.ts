import { Client, Collection, GatewayIntentBits } from "discord.js";
import { env } from "../env";

import { handleCommands } from "../lib/utils/command-handler";
import { handleEvents } from "../lib/utils/event-handler";
import { handleComponents } from "../lib/utils/component-handler";

const client = new Client({
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.components = new Collection();
client.fishingSessions = new Collection();

handleEvents(client);
handleCommands(client);
handleComponents(client);

client.login(env.CLIENT_TOKEN);
