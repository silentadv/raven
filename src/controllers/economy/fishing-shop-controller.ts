import { tools } from "@/constants";
import { icons } from "@/lib/emojis";
import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export interface FishingShopControllerRequest {
  userDiscordId: string;
}

export class FishingShopController {
  public async handle({ userDiscordId }: FishingShopControllerRequest) {
    const emojis = [
      icons.static.indicator_one,
      icons.static.indicator_two,
      icons.static.indicator_three,
      icons.static.indicator_four,
      icons.static.indicator_five,
    ];

    const itemFields = Object.values(tools).map((tool, i) => {
      const indicatorIcon = emojis[i] || icons.static.indicator_zero;
      const itemIcon = icons.static[tool.id as keyof (typeof icons)["static"]];

      return {
        name: `${indicatorIcon} ${itemIcon} ${tool.name}`,
        value: `> **${icons.static.ravits} \`${tool.ravits_price}\` ravits **`,
      };
    });

    const itemOptions = Object.values(tools).map((tool, i) => {
      const indicatorIcon = emojis[i] || icons.static.indicator_zero;

      return new StringSelectMenuOptionBuilder()
        .setEmoji(indicatorIcon.id)
        .setDescription("Clique aqui para comprar este item.")
        .setLabel(tool.name)
        .setValue(tool.id);
    });

    const itemsMenu = new StringSelectMenuBuilder()
      .setCustomId(`buy-item/:${userDiscordId}/:fishing`)
      .setMaxValues(1)
      .setMinValues(1)
      .setPlaceholder("Clique aqui para selecionar um item.")
      .setOptions(itemOptions);

    const row = new ActionRowBuilder<typeof itemsMenu>().setComponents(
      itemsMenu
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Mercado Raven | Loja de Pesca")
      .setDescription(
        `> ${icons.static.info} | <@${userDiscordId}>, **veja** logo **abaixo** a **lista** de **itens disponíveis** na **loja**, caso deseje **comprar** algum **basta** o **selecionar**.`
      )
      .setFields(itemFields);

    return { embeds: [embed], components: [row] };
  }
}
