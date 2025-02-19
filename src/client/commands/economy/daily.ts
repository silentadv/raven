import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { makeApplyCooldownUseCase } from "@/use-cases/factories/make-apply-cooldown-use-case";
import { makeCharacterObtainItemUseCase } from "@/use-cases/factories/make-character-obtain-item-use-case";
import { makeFetchUserCharactersUseCase } from "@/use-cases/factories/make-fetch-user-characters-use-case";
import { makeGetCooldownUseCase } from "@/use-cases/factories/make-get-cooldown-use-case";
import { CooldownType } from "@prisma/client";
import dayjs from "dayjs";

export default makeCommand({
  name: "daily",
  category: "economy",
  aliases: [],
  async handle({ message }) {
    const getCooldownUseCase = makeGetCooldownUseCase();
    const applyCooldownUseCase = makeApplyCooldownUseCase();

    const { cooldown } = await getCooldownUseCase.handle({
      cooldownType: CooldownType.DAILY,
      userDiscordId: message.author.id,
    });

    if (!cooldown || cooldown.date.getTime() <= Date.now()) {
      const fetchUserCharactersUseCase = makeFetchUserCharactersUseCase();
      const { characters } = await fetchUserCharactersUseCase.handle({
        userDiscordId: message.author.id,
      });

      const guildsRepository = new PrismaGuildsRepository();
      const currentGuild = await guildsRepository.findByDiscordId(
        message.guild.id
      );

      const userCurrentMainCharacter =
        characters.find(
          (character) => character.guild_id === currentGuild?.id
        ) || characters.at(0)!;

      const characterObtainItemUseCase = makeCharacterObtainItemUseCase();
      const amountOfPrismasInReward = Math.floor(Math.random() * 500 + 100);

      await characterObtainItemUseCase.handle({
        characterId: userCurrentMainCharacter.id,
        itemCount: amountOfPrismasInReward,
        itemId: "prisma",
      });

      const cooldownDate = dayjs(new Date()).add(1, "day").toDate();

      await applyCooldownUseCase.handle({
        cooldownDate,
        cooldownType: CooldownType.DAILY,
        userDiscordId: message.author.id,
      });

      return message.reply(
        joinText(
          `> ${icons.static.success} | ${message.author}, você **coletou** sua ** [ ${icons.static.gift} | Recompensa Diária ]** com **sucesso** e **recebeu** \`${amountOfPrismasInReward}\` **[ ${icons.static.prisma} | Prismas ]**.`,
          `> -# Volte novamente em **24 horas** para **coletar** sua **próxima recompensa**.`
        )
      );
    } else
      return message.reply(
        `> ${icons.static.clock} | ${message.author}, sua **[ ${
          icons.static.gift
        } | Recompensa Diária ]**  ainda **está** em **cooldown**, volte **novamente** em: <t:${Math.floor(
          cooldown.date.getTime() / 1000
        )}:R>`
      );
  },
});
