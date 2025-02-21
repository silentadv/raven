import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { makeInspectItemUseCase } from "@/use-cases/factories/make-inspect-item-use-case";

export default makeCommand({
  name: "balance",
  category: "economy",
  aliases: ["bal", "prismas", "currency"],
  async handle({ message }) {
    const inspectItemUseCase = makeInspectItemUseCase();

    const { item } = await inspectItemUseCase.handle({
      itemId: "prisma",
      userDiscordId: message.author.id,
    });

    const prismas = item ? item.count : 0;

    return message.reply(
      joinText(
        `> ${icons.static.backpack} | ${message.author}, você **possui** em seu **inventário** \`${prismas}\` **[ ${icons.static.prisma} | Prismas ]**.`,
        `> -# Utilize **r.daily** para **coletar** sua **recompensa diária**`
      )
    );
  },
});
