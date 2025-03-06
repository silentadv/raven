import { icons } from "@/lib/emojis";
import { makeListMenu } from "@raven-ui/menus/list-menu";
import { makeFieldList } from "@raven-ui/string/list";
import { ActionRowBuilder, Colors, EmbedBuilder } from "discord.js";

export interface MainShopControllerRequest {
  userDiscordId: string;
}

export class MainShopController {
  public async handle({ userDiscordId }: MainShopControllerRequest) {
    const fields = makeFieldList({
      name: "Loja de Pesca",
      value: "> Navegue pela loja de pesca.",
    });

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setTitle("Mercado Raven | Página Inicial")
      .setDescription(
        `> ${icons.static.info} | <@${userDiscordId}>, **selecione** uma **loja** para **ver** seus **itens disponíveis**.`
      )
      .setFields(fields);

    const menu = makeListMenu(`shop-menu/:${userDiscordId}`, [
      { label: "Pagina Inicial", value: "main", default: true },
      { label: "Loja de Pesca", value: "fishing" },
    ]);

    const row = new ActionRowBuilder<typeof menu>().setComponents(menu);

    return { embeds: [embed], components: [row] };
  }
}
