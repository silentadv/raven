import { makeCommand } from "@/lib/factories/make-command";
import { inspect } from "util";

export default makeCommand({
  name: "eval",
  category: "dev",
  aliases: ["e", "ev"],
  parse(args) {
    const regex = /--?(\w+)|(\S+)/g;
    const matches = [];
    let match;

    while ((match = regex.exec(args.join(" "))) !== null) {
      matches.push(match);
    }

    const commands = matches.map((m) => m[1]).filter(Boolean);
    const code = matches
      .map((m) => m[2])
      .filter(Boolean)
      .join(" ");

    return { code, commands };
  },
  async handle({ args, client, message }) {
    const { code, commands } = args;

    try {
      const evaled = await eval(code);
      const response = typeof evaled === "string" ? evaled : inspect(evaled);

      console.log(response);

      if (commands.includes("silent") || commands.includes("s"))
        return message.reply("🔥");

      if (commands.includes("dm")) {
        const dm =
          message.author.dmChannel || (await message.author.createDM(true));

        return dm
          .send(`\`\`\`js\n${response.slice(0, 1900)}\`\`\``)
          .catch(console.error);
      }

      return message.reply(`\`\`\`js\n${response.slice(0, 1900)}\`\`\``);
    } catch (error) {
      if (error instanceof Error)
        return message.reply(
          `\`\`\`js\nErro: ${error.message.slice(0, 1900)}\`\`\``
        );

      console.error(error);
      return message.reply("Erro!");
    }
  },
});
