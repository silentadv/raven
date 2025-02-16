import { makeCommand } from "@/utils/factories/make-command";

export default makeCommand({
  name: "ping",
  category: "utils",
  aliases: ["pong", "latency", "latência"],
  handle({ client, message }) {
    return message.reply(
      `> Pong! ${message.author}, minha latência atual é de **${client.ws.ping}ms**.`
    );
  },
});
