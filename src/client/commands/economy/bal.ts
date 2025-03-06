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

    const { item: prismaItem } = await inspectItemUseCase.handle({
      itemId: "prisma",
      userDiscordId: message.author.id,
    });

    const { item: ravitsItem } = await inspectItemUseCase.handle({
      itemId: "ravits",
      userDiscordId: message.author.id,
    });

    const prismas = prismaItem ? prismaItem.count : 0;
    const ravits = ravitsItem ? ravitsItem.count : 0;

    return message.reply(
      joinText(
        `> ${icons.static.backpack} | ${message.author}, você **possui** em sua **carteira** ${icons.static.ravits} **\`${ravits}\` ravits** e${icons.static.prisma}**\`${prismas}\` prismas**.`,
        `> -# Utilize **r.daily** para **coletar** sua **recompensa diária**`
      )
    );
  },
});
