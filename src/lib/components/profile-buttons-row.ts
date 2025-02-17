import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { icons } from "../emojis";
import { Character } from "@prisma/client";

export function createProfileButtonsRow(
  userDiscordId: string,
  currentCharacterProfile: Character
) {
  const editCharacterButton = new ButtonBuilder()
    .setCustomId(
      `edit-character/:${userDiscordId}/:${currentCharacterProfile.id}`
    )
    .setEmoji(icons.static.pencil.id)
    .setLabel("| Editar Personagem")
    .setStyle(ButtonStyle.Primary);

  const allocateCharacterPointsButton = new ButtonBuilder()
    .setCustomId(
      `up-character/:${userDiscordId}/:${currentCharacterProfile.id}`
    )
    .setEmoji(icons.static.points.id)
    .setLabel("| Utilizar Pontos")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(currentCharacterProfile.points <= 0);

  const reloadProfileButton = new ButtonBuilder()
    .setCustomId(
      `reload-character/:${userDiscordId}/:${currentCharacterProfile.id}`
    )
    .setEmoji(icons.static.reload.id)
    .setStyle(ButtonStyle.Primary);

  const actionsRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
    editCharacterButton,
    allocateCharacterPointsButton,
    reloadProfileButton
  );

  return actionsRow;
}
