import { ItemId, tools } from "@/constants";
import { icons } from "@/lib/emojis";
import { makeComponent } from "@/lib/factories/make-component";
import { ComponentType } from "@/types/component";
import { makeDecrementItemUseCase } from "@/use-cases/factories/make-decrement-item-use-case";
import { makeInspectItemUseCase } from "@/use-cases/factories/make-inspect-item-use-case";
import { makeObtainItemUseCase } from "@/use-cases/factories/make-obtain-item-use-case";
import { ItemType } from "@prisma/client";
import { makeNumberModal } from "@raven-ui/modals/number-modal";
import { MessageFlags } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "buy-item/:userId/:shop/:item",
  name: "buy-item",
  schema: z.object({
    userId: z.string(),
    shop: z.literal("fishing"),
    item: z.string().optional(),
  }),
  types: [ComponentType.StringSelectMenu, ComponentType.Modal],
  async execute({ interaction, args }) {
    if (interaction.isStringSelectMenu()) {
      const itemId = interaction.values[0];

      const modal = makeNumberModal(
        `buy-item/:${args.userId}/:${args.shop}/:${itemId}`,
        `Comprar Item`
      );

      return interaction.showModal(modal);
    }

    if (interaction.isModalSubmit()) {
      const countFieldValue = interaction.fields.getTextInputValue("count");
      const count = Number(countFieldValue);

      if (isNaN(count) || count <= 0)
        return interaction.reply({
          content: `> ${icons.static.danger} | ${interaction.user} **ocorreu** um **erro**, você **inseriu** uma **quantia invalida**.`,
          flags: [MessageFlags.Ephemeral],
        });

      const selctedItemId = args.item;
      const item = Object.values(tools).find(
        (tool) => tool.id === selctedItemId
      );

      if (!item)
        return interaction.reply({
          content: `> ${icons.static.danger} | ${interaction.user} **ocorreu** um **erro**, você **selecionou** um **item inválido**.`,
          flags: [MessageFlags.Ephemeral],
        });

      const { ravits_price: itemPrice } = item;
      const totalPrice = itemPrice * count;

      const inspectItemUseCase = makeInspectItemUseCase();
      const { item: ravitsItem } = await inspectItemUseCase.handle({
        itemId: "ravits",
        userDiscordId: interaction.user.id,
      });

      const userRavits = ravitsItem ? ravitsItem.count : 0;

      if (totalPrice > userRavits)
        return interaction.reply({
          content: `> ${icons.static.danger} | ${interaction.user} **ocorreu** um **erro**, você **não** possui **ravits suficiente**.`,
          flags: [MessageFlags.Ephemeral],
        });

      const decrementItemUseCase = makeDecrementItemUseCase();
      await decrementItemUseCase.handle({
        userDiscordId: args.userId,
        itemCount: totalPrice,
        itemId: "ravits",
      });

      const obtainItemUseCase = makeObtainItemUseCase();
      await obtainItemUseCase.handle({
        userDiscordId: interaction.user.id,
        itemCount: count,
        itemId: item.id as ItemId,
        itemType: ItemType.Tool,
      });

      const itemIcon = icons.static[item.id as keyof (typeof icons)["static"]];

      return interaction.reply({
        content: `> ${icons.static.success} | ${interaction.user}, você **comprou** com **sucesso** ${itemIcon} \`x${count}\` **${item.name}** por ${icons.static.ravits} \`${totalPrice}\` **ravits**.`,
        flags: [MessageFlags.Ephemeral],
      });
    }
  },
});
