import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { icons } from "../emojis";
import { User } from "@prisma/client";

export function createProfileButtonsRow(user: User) {
  const allocateCharacterPointsButton = new ButtonBuilder()
    .setCustomId(`up-character/:${user.discord_id}`)
    .setEmoji(icons.static.points.id)
    .setLabel("| Utilizar Pontos")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(user.points <= 0);

  const reloadProfileButton = new ButtonBuilder()
    .setCustomId(`reload-profile/:${user.discord_id}`)
    .setEmoji(icons.static.reload.id)
    .setLabel("| Recarregar Perfil")
    .setStyle(ButtonStyle.Primary);

  const actionsRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
    allocateCharacterPointsButton,
    reloadProfileButton
  );

  return actionsRow;
}
