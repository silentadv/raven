import { INDICATORS } from "@raven-ui/constants/emojis";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";

export interface ListMenuField {
  label: string;
  value?: string;
  default?: boolean;
}

export function makeListMenu(
  id: string,
  rawOptions: ListMenuField[],
  min = 1,
  max = 1
) {
  const options = rawOptions.slice(0, 8).map((raw, i) =>
    new StringSelectMenuOptionBuilder()
      .setDescription("Clique aqui para selecionar esta opção.")
      .setEmoji(INDICATORS[i].id)
      .setLabel(raw.label)
      .setValue(raw.value || raw.label)
      .setDefault(!!raw.default)
  );

  return new StringSelectMenuBuilder()
    .setCustomId(id)
    .setMinValues(min)
    .setMaxValues(max)
    .setOptions(options)
    .setPlaceholder("Clique aqui para selecionar uma opção.");
}
