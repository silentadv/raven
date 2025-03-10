import { ItemId } from "@/constants";
import { icons } from "@/lib/emojis";
import { ItemType } from "@prisma/client";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export interface BaseItem {
  id: ItemId;
  name: string;
}

export function makeItemMenu(id: string, items: BaseItem[], max = 1, min = 1) {
  const emojis = items.map(
    (item) => icons.static[item.id as keyof (typeof icons)["static"]]
  );

  const options = items.map((item, i) => {
    const emoji = emojis[i];
    return new StringSelectMenuOptionBuilder()
      .setEmoji(emoji.id)
      .setLabel(item.name)
      .setDescription("Clique aqui para selecionar este item")
      .setValue(`${item.id}`);
  });

  const menu = new StringSelectMenuBuilder()
    .setCustomId(id)
    .setPlaceholder("Clique aqui para selecionar um item.")
    .setMinValues(min)
    .setMaxValues(max)
    .setOptions(options);

  return menu;
}
