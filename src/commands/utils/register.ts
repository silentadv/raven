import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { makeCommand } from "@/utils/factories/make-command";
import { joinText } from "@/utils/join-text";

export default makeCommand({
  name: "register",
  category: "utils",
  aliases: ["registrar"],
  async handle({ message }) {
    const loadingMessage = await message.reply(
      `> 🛰️ | ${message.author}, você está sendo **registrado** aguarde...`
    );

    const registerUseCase = makeRegisterUseCase();

    try {
      await registerUseCase.handle({
        userDiscordId: message.author.id,
      });
    } catch (error) {
      return await loadingMessage.edit(
        joinText(
          `> ❌ | ${message.author}, você já está **registrado** no meu **banco de dados**`,
          `> -# Utilize **r.start** para criar um **personagem**.`
        )
      );
    }

    await loadingMessage.edit(
      `> ✅ | ${message.author}, você foi **registrado** com **sucesso**!`
    );
  },
});
