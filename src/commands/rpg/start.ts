import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { makeCreateCharacterUseCase } from "@/use-cases/factories/make-create-character-use-case";
import { makeCommand } from "@/utils/factories/make-command";
import { joinText } from "@/utils/join-text";

const parse = (args: string[]) => {
  const name = args[0];

  if (!name)
    throw new Error(
      `Utilize **r.start <nome-do-personagem>** para **criar** seu **personagem**.`
    );

  return {
    name,
  };
};

export default makeCommand({
  name: "start",
  category: "rpg",
  aliases: ["iniciar"],
  async handle({ message, args: { name } }) {
    const createCharacterUseCase = makeCreateCharacterUseCase();

    const { character } = await createCharacterUseCase.handle({
      userDiscordId: message.author.id,
      characterGuildDiscordId: message.guild.id,
      characterName: name,
    });

    const guildsRepository = new PrismaGuildsRepository();
    const guild = (await guildsRepository.findByDiscordId(message.guild.id))!;

    return message.reply(
      joinText(
        `> ✅ | ${message.author}, você **criou** com sucesso o **personagem** \`${name}\` na **guilda** \`${guild.name}\`.`,
        `>  Você recebeu **10** pontos de atributo iniciais para distribuir no seu personagem.`,
        `> -# Utilize **r.profile** para ver o **perfil** do seu **personagem**.`
      )
    );
  },
  parse,
});
