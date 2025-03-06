import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export default makeCommand({
  name: "register",
  category: "utils",
  aliases: ["registrar"],
  async handle({ message }) {
    const registerUseCase = makeRegisterUseCase();

    try {
      await registerUseCase.handle({
        userDiscordId: message.author.id,
      });

      return message.reply(
        joinText(
          `> ${icons.static.success} | ${message.author}, você se **registrou** com **sucesso** no meu **banco de dados**.`,
          `> -# Utilize **r.help** para ver meus comandos.`
        )
      );
    } catch (error) {
      return message.reply(
        joinText(
          `> ${icons.static.danger} | **Ocorreu** um **erro** ${message.author}, você já **está registrado** em meu **banco de dados**.`,
          `> -# Utilize **r.help** para ver meus comandos.`
        )
      );
    }
  },
});
