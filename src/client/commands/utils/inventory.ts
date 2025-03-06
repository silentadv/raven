import { tools } from "@/constants";
import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { makeFetchItemsUseCase } from "@/use-cases/factories/make-fetch-items-use-case";
import { ItemType } from "@prisma/client";

export default makeCommand({
  name: "inventory",
  category: "utils",
  aliases: ["inv", "inventario", "backpack", "mochila"],
  async handle({ message }) {
    const fetchItemsUseCase = makeFetchItemsUseCase();
    const { items } = await fetchItemsUseCase.handle({
      userDiscordId: message.author.id,
    });

    const list = items
      .filter((item) => item.count > 0 && item.type === ItemType.Tool)
      .map((item) => {
        const { name } = tools[item.item_id as keyof typeof tools];
        const emoji =
          icons.static[item.item_id as keyof (typeof icons)["static"]];
        return `> - **${emoji} \`${item.count}x\` ${name}**`;
      });

    return message.reply(
      joinText(
        `> ${icons.static.backpack} | ${message.author}, veja **abaixo** os **itens** que **você possui** em seu **inventário**:`,
        list.join("\n") || "`> ...vazio`"
      )
    );
  },
});
