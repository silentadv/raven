import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export function makeNumberModal(id: string, title: string) {
  const input = new TextInputBuilder()
    .setCustomId(`count`)
    .setLabel("Quantidade")
    .setMaxLength(3)
    .setMinLength(1)
    .setPlaceholder("1")
    .setValue("1")
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

  const row = new ActionRowBuilder<typeof input>().setComponents(input);

  const modal = new ModalBuilder()
    .setCustomId(id)
    .setTitle(title)
    .setComponents(row);

  return modal;
}
