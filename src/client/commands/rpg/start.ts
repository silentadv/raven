import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { icons } from "@/lib/emojis";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";

export default makeCommand({
  name: "start",
  category: "rpg",
  aliases: ["iniciar"],
  async handle({ message }) {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.handle({
      userDiscordId: message.author.id,
    });

    return message.reply(
      joinText(
        `> ${icons.static.success} | ${message.author}, você **criou** com **sucesso** seu o **personagem**.`,
        `> - Você recebeu \`10\` **[ ${icons.static.points} | Pontos de Atributo ]** para utilizar no seu personagem.`,
        `> -# Utilize **r.profile** para ver o **perfil** do seu **personagem**.`
      )
    );
  },
});
