import type { Character } from "@prisma/client";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export function createEditCharacterModal(userId: string, character: Character) {
  const modal = new ModalBuilder()
    .setCustomId(`edit-character/:${userId}/:${character.id}`)
    .setTitle(`Editar Personagem | ${character.name}`);

  const nameInput = new TextInputBuilder()
    .setCustomId(`name`)
    .setLabel("Nome do Personagem")
    .setMaxLength(25)
    .setMinLength(1)
    .setPlaceholder(character.name)
    .setRequired(true)
    .setStyle(TextInputStyle.Short);

  const nameActionRow = new ActionRowBuilder<TextInputBuilder>().setComponents(
    nameInput
  );

  modal.setComponents(nameActionRow);

  return modal;
}
