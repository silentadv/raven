import { tools } from "@/constants";
import { icons } from "@/lib/emojis";
import { ListMenuField, makeListMenu } from "@raven-ui/menus/list-menu";
import { ListField, makeFieldList } from "@raven-ui/string/list";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
} from "discord.js";

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

    const backButton = new ButtonBuilder()
      .setCustomId(`shop-menu/:${userDiscordId}`)
      .setEmoji(icons.static.danger.id)
      .setLabel("Sair da Loja")
      .setStyle(ButtonStyle.Secondary);

    const backButtonRow = new ActionRowBuilder<
      typeof backButton
    >().setComponents(backButton);

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setAuthor({ name: "Selecione um item para comprar" })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1347628969079341097/1347630039843213332/basic_rod.png?ex=67cc85c7&is=67cb3447&hm=5a5807b8609d0f6c45713a876a746835298e0cf3038b5fc2742b7cb52c3457f5&"
      )
      .setDescription(
        `> ${icons.static.info} | <@${userDiscordId}>, **veja** logo **abaixo** a **lista** de **itens disponíveis** na **loja**, caso deseje **comprar** algum **basta** o **selecionar**.`
      )
      .setFields(itemFields);

    return { embeds: [embed], components: [itemsRow, backButtonRow] };
  }
}
