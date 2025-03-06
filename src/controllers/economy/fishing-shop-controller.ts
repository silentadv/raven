import { tools } from "@/constants";
import { icons } from "@/lib/emojis";
import { ListMenuField, makeListMenu } from "@raven-ui/menus/list-menu";
import { ListField, makeFieldList } from "@raven-ui/string/list";
import { ActionRowBuilder, Colors, EmbedBuilder } from "discord.js";

export interface FishingShopControllerRequest {
  userDiscordId: string;
}

export class FishingShopController {
  public async handle({ userDiscordId }: FishingShopControllerRequest) {
    const itemRawFields = Object.values(tools).map((tool) => {
      const itemIcon = icons.static[tool.id as keyof (typeof icons)["static"]];

      return {
        name: `${itemIcon} ${tool.name}`,
        value: `> **${icons.static.ravits} \`${tool.ravits_price}\` ravits **`,
      };
    }) satisfies ListField[];

    const itemFields = makeFieldList(...itemRawFields);

    const itemRawOptions = Object.values(tools).map((tool) => ({
      label: tool.name,
      value: tool.id,
    })) satisfies ListMenuField[];

    const itemsMenu = makeListMenu(
      `buy-item/:${userDiscordId}/:fishing`,
      itemRawOptions
    ).setPlaceholder("Clique aqui para comprar um item.");

    const itemsRow = new ActionRowBuilder<typeof itemsMenu>().setComponents(
      itemsMenu
    );

    const mainMenu = makeListMenu(`shop-menu/:${userDiscordId}`, [
      { label: "Pagina Inicial", value: "main" },
      { label: "Loja de Pesca", value: "fishing", default: true },
    ]);

    const mainRow = new ActionRowBuilder<typeof mainMenu>().setComponents(
      mainMenu
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Mercado Raven | Loja de Pesca")
      .setDescription(
        `> ${icons.static.info} | <@${userDiscordId}>, **veja** logo **abaixo** a **lista** de **itens disponíveis** na **loja**, caso deseje **comprar** algum **basta** o **selecionar**.`
      )
      .setFields(itemFields);

    return { embeds: [embed], components: [mainRow, itemsRow] };
  }
}
