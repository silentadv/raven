import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { icons } from "@/lib/emojis";

export default makeCommand({
  name: "register",
  category: "utils",
  aliases: ["registrar"],
  async handle({ message }) {
    const loadingMessage = await message.reply(
      `> ${icons.static.folder} | ${message.author}, você está sendo **registrado** aguarde...`
    );
    const registerUseCase = makeRegisterUseCase();

    try {
      await registerUseCase.handle({
        userDiscordId: message.author.id,
      });
    } catch (error) {
      return await loadingMessage.edit(
        joinText(
          `> ${icons.static.danger} | ${message.author}, você já está **registrado** no meu **banco de dados**`,
          `> -# Utilize **r.start** para criar um **personagem**.`
        )
      );
    }

    await loadingMessage.edit(
      `> ${icons.static.success} | ${message.author}, você foi **registrado** com **sucesso** no meu **banco de dados**!`
    );
  },
});
