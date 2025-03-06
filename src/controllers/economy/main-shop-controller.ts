import { icons } from "@/lib/emojis";
import {
  ActionRowBuilder,
  Colors,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export interface MainShopControllerRequest {
  userDiscordId: string;
}

export class MainShopController {
  public async handle({ userDiscordId }: MainShopControllerRequest) {
    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Mercado Raven | Página Inicial")
      .setDescription(
        `> ${icons.static.info} | <@${userDiscordId}>, **selecione** uma **loja** para **ver** seus **itens disponíveis**.`
      )
      .setFields([
        {
          name: `${icons.static.indicator_one}  Loja de Pesca`,
          value: "> Navegue pela loja de pesca.",
        },
      ]);

    const menuOptions: StringSelectMenuOptionBuilder[] = [
      new StringSelectMenuOptionBuilder()
        .setEmoji(icons.static.indicator_zero.id)
        .setDescription("Clique aqui para selecionar esta aba")
        .setLabel("Página Inicial")
        .setValue(`main`)
        .setDefault(true),

      new StringSelectMenuOptionBuilder()
        .setEmoji(icons.static.indicator_one.id)
        .setDescription("Clique aqui para selecionar esta aba")
        .setLabel("Loja de Pesca")
        .setValue(`fishing`),
    ];

    const menu = new StringSelectMenuBuilder()
      .setPlaceholder("Clique aqui para selecionar.")
      .setCustomId(`shop-menu/:${userDiscordId}`)
      .setOptions(menuOptions)
      .setMaxValues(1)
      .setMinValues(1);

    const row = new ActionRowBuilder<typeof menu>().setComponents(menu);

    return { embeds: [embed], components: [row] };
  }
}
