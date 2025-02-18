import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { makeCreateCharacterUseCase } from "@/use-cases/factories/make-create-character-use-case";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { icons } from "@/lib/emojis";

const parse = (args: string[]) => {
  const name = args.join(" ");

  if (!name)
    throw new Error(
      `Utilize **r.start <nome-do-personagem>** para **criar** seu **personagem**.`
    );

  return {
    name: name.slice(0, 25),
  };
};

export default makeCommand({
  name: "start",
  category: "rpg",
  aliases: ["iniciar"],
  async handle({ message, args: { name } }) {
    const createCharacterUseCase = makeCreateCharacterUseCase();

    await createCharacterUseCase.handle({
      userDiscordId: message.author.id,
      characterGuildDiscordId: message.guild.id,
      characterName: name,
    });

    const guildsRepository = new PrismaGuildsRepository();
    const guild = (await guildsRepository.findByDiscordId(message.guild.id))!;

    return message.reply(
      joinText(
        `> ${icons.static.success} | ${message.author}, você **criou** com **sucesso** o **personagem** \`${name}\`, agora ele faz parte da **guilda** \`${guild.name}\`.`,
        `> - Você recebeu \`10\` **[ ${icons.static.points} | Pontos de Atributo ]** para utilizar no seu personagem.`,
        `> -# Utilize **r.profile** para ver o **perfil** do seu **personagem**.`
      )
    );
  },
  parse,
});
