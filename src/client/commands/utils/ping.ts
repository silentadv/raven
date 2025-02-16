import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";

export default makeCommand({
  name: "ping",
  category: "utils",
  aliases: ["pong", "latency", "latência"],
  handle({ client, message }) {
    return message.reply(
      `> ${icons.static.connection} | Pong! ${message.author}, minha latência atual é de **${client.ws.ping}ms**.`
    );
  },
});
