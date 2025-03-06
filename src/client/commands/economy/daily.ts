import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { makeApplyCooldownUseCase } from "@/use-cases/factories/make-apply-cooldown-use-case";
import { makeGetCooldownUseCase } from "@/use-cases/factories/make-get-cooldown-use-case";
import { makeObtainItemUseCase } from "@/use-cases/factories/make-obtain-item-use-case";
import { CooldownType, ItemType } from "@prisma/client";
import dayjs from "dayjs";

export default makeCommand({
  name: "daily",
  category: "economy",
  aliases: [],
  async handle({ message }) {
    const getCooldownUseCase = makeGetCooldownUseCase();
    const applyCooldownUseCase = makeApplyCooldownUseCase();

    const { cooldown } = await getCooldownUseCase.handle({
      cooldownType: CooldownType.Daily,
      userDiscordId: message.author.id,
    });

    if (!cooldown || cooldown.date.getTime() <= Date.now()) {
      const obtainItemUseCase = makeObtainItemUseCase();
      const amountOfravitsInReward = Math.floor(Math.random() * 750 + 250);

      await obtainItemUseCase.handle({
        userDiscordId: message.author.id,
        itemCount: amountOfravitsInReward,
        itemId: "ravits",
        itemType: ItemType.Currency,
      });

      const cooldownDate = dayjs(new Date()).add(1, "day").toDate();

      await applyCooldownUseCase.handle({
        cooldownDate,
        cooldownType: CooldownType.Daily,
        userDiscordId: message.author.id,
      });

      return message.reply(
        joinText(
          `> ${icons.static.success} | ${message.author}, você **coletou** sua ** [ ${icons.static.gift} | Recompensa Diária ]** com **sucesso** e **recebeu** ${icons.static.ravits} **\`${amountOfravitsInReward}\` ravits**.`,
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
