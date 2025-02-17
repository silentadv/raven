import type { Character } from "@prisma/client";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export function createUpCharacterModal(userId: string, character: Character) {
  const modal = new ModalBuilder()
    .setCustomId(`up-character/:${userId}/:${character.id}`)
    .setTitle(`Distribuir Pontos de Atributo | ${character.name}`);

  const strengthInput = new TextInputBuilder()
    .setCustomId(`strength`)
    .setLabel("Força")
    .setMaxLength(3)
    .setMinLength(1)
    .setPlaceholder("0")
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

  const magicInput = new TextInputBuilder()
    .setCustomId(`magic`)
    .setLabel("Magia")
    .setMaxLength(3)
    .setMinLength(1)
    .setPlaceholder("0")
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

  const agilityInput = new TextInputBuilder()
    .setCustomId(`agility`)
    .setLabel("Agilidade")
    .setMaxLength(3)
    .setMinLength(1)
    .setPlaceholder("0")
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

  const resistanceInput = new TextInputBuilder()
    .setCustomId(`resistance`)
    .setLabel("Resistência")
    .setMaxLength(3)
    .setMinLength(1)
    .setPlaceholder("0")
    .setRequired(false)
    .setStyle(TextInputStyle.Short);

  const strengthRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
    strengthInput
  );
  const magicRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
    magicInput
  );
  const agilityRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
    agilityInput
  );
  const resistanceRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
    resistanceInput
  );

  modal.setComponents(strengthRow, magicRow, agilityRow, resistanceRow);

  return modal;
}
