import { icons } from "@/lib/emojis";
import { makeListMenu } from "@raven-ui/menus/list-menu";
import { makeFieldList } from "@raven-ui/string/list";
import { ActionRowBuilder, Colors, EmbedBuilder } from "discord.js";

export interface MainShopControllerRequest {
  userDiscordId: string;
}

export class MainShopController {
  public async handle({ userDiscordId }: MainShopControllerRequest) {
    const fields = makeFieldList(
      {
        name: `${icons.static.market_cart} Pagina Inicial`,
        value: "> Contém informações sobre as lojas disponíveis.",
      },
      {
        name: `${icons.static.basic_rod} Loja de Pesca`,
        value: "> Navegue pela loja de pesca.",
      }
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setAuthor({ name: "Selecione a loja que você deseja navegar." })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1347628969079341097/1347628999236522025/market_cart.png?ex=67cc84cf&is=67cb334f&hm=17edcb390118eada71ff39d0ee8df985e6689d40f59d2f27b44bd4fefd9838ad&"
      )
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
