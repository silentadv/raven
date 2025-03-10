import { tools } from "@/constants";
import { icons } from "@/lib/emojis";
import { joinText } from "@/lib/utils/join-text";
import { FishingData } from "@/types/fishing";
import { makeInspectItemUseCase } from "@/use-cases/factories/make-inspect-item-use-case";
import { Item } from "@prisma/client";
import { makeFieldList } from "@raven-ui/string/list";
import {
  EmbedBuilder,
  Colors,
  User,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

export interface FishingBoardControllerRequest {
  user: User;
  session: FishingData;
}

export class FishingBoardController {
  public async handle({ user, session }: FishingBoardControllerRequest) {
    const inspectItemUseCase = makeInspectItemUseCase();
    const { item: baitItem } = (await inspectItemUseCase.handle({
      userDiscordId: user.id,
      itemId: session.tools.bait,
    })) as { item: Item };

    const baitEmoji = icons.static[session.tools.bait];
    const baitName = tools[session.tools.bait as keyof typeof tools].name;

    const rodEmoji = icons.static[session.tools.rod];
    const rodName = tools[session.tools.rod as keyof typeof tools].name;
    const rodTotalUses = session.tools.rod === "fisherman_rod" ? 25 : 10;
    const rodUses = rodTotalUses - session.fishCount;

    const fields = makeFieldList(
      {
        name: " Ferramentas",
        value: joinText(
          `> - **${rodEmoji} ${rodName} \`[${rodUses}/${rodTotalUses}]\`**`,
          `> - **${baitEmoji} \`x${baitItem.count}\` ${baitName}**`
        ),
      },
      { name: " Drops", value: "> `... vazio`" }
    );

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkRed)
      .setAuthor({ name: "Aguarde um peixe fisgar a isca" })
      .setThumbnail(
        "https://cdn.discordapp.com/attachments/1347628969079341097/1347630039843213332/basic_rod.png?ex=67cc85c7&is=67cb3447&hm=5a5807b8609d0f6c45713a876a746835298e0cf3038b5fc2742b7cb52c3457f5&"
      )
      .setDescription(
        joinText(
          `> ${icons.static.success} | ${user}, **você começou** sua **sessão de pesca** com **sucesso**, aguarde um **peixe fisgar a isca**.`,
          `> -# Dica: quando um alerta aparecer clique no botão para recolher a linha e pegar o peixe fisgado!`
        )
      )
      .setFields(fields);

    const getFishButton = new ButtonBuilder()
      .setCustomId(`get-fish/:${user.id}`)
      .setEmoji(icons.static.sparkles.id)
      .setLabel("Recolher a Linha")
      .setStyle(ButtonStyle.Secondary);

    const exitButton = new ButtonBuilder()
      .setCustomId(`exit-fish/:${user.id}`)
      .setEmoji(icons.static.danger.id)
      .setLabel("Sair da Sessão")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().setComponents(getFishButton, exitButton);

    return {
      content: "",
      components: [row],
      embeds: [embed],
    };
  }
}
