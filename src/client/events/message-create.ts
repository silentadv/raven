import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { makeEvent } from "@/lib/factories/make-event";
import { joinText } from "@/lib/utils/join-text";
import { icons } from "@/lib/emojis";

const BOT_PREFIX = "r.";

export default makeEvent({
  name: "messageCreate",
  async handle(client, message) {
    if (!message.inGuild() || message.author.bot || !client.isReady()) return;
    if (message.content === `${client.user}`)
      return message.reply(
        joinText(
          `> ${icons.static.info} | Olá! ${message.author}, meu prefixo neste servidor é **${BOT_PREFIX}**`,
          `> -# Utilize **${BOT_PREFIX}help** para ver meus **comandos**.`
        )
      );

    if (!message.content.startsWith(BOT_PREFIX)) return;

    const args = message.content.slice(BOT_PREFIX.length).trim().split(" ");
    const commandName = args.shift();
    if (!commandName) return;

    const command =
      client.commands.get(commandName) ||
      client.commands.find((command) => command.aliases.includes(commandName));

    if (command) {
      try {
        let parsedArgs = args;

        if (command.parse) parsedArgs = command.parse(args);
        return await command.handle({
          client,
          message,
          args: parsedArgs,
        });
      } catch (error) {
        if (error instanceof ResourceNotFoundError && error.resource === "user")
          return message.reply(
            joinText(
              `> ${icons.static.danger} | ${message.author}, **não** encontrei seu **registro** em meu **banco de dados**.`,
              `> -# Utilize **${BOT_PREFIX}register** para se **registrar** em meu **banco de dados**.`
            )
          );

        if (
          error instanceof ResourceNotFoundError &&
          error.resource === "character"
        )
          return message.reply(
            joinText(
              `> ${icons.static.danger} | ${message.author}, **não** encontrei um **personagem** seu em meu **banco de dados**.`,
              `> -# Utilize **${BOT_PREFIX}start** para **criar** um **personagem**.`
            )
          );

        if (error instanceof Error)
          return message.reply(
            joinText(
              `> ${icons.static.danger} | ${message.author}, ocorreu um erro ao executar este comando:`,
              `> -# ${error.message}`
            )
          );
      }
    }
  },
});
