import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { Character } from "@prisma/client";
import {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { icons } from "../emojis";

export async function createUserCharactersMenu(
  userId: string,
  characters: Character[]
) {
  if (!characters.length) throw new ResourceNotFoundError("character");

  const options = characters.map((character) => {
    const option = new StringSelectMenuOptionBuilder()
      .setLabel(`| ${character.name}`)
      .setEmoji(icons.static.user.id)
      .setDescription(
        `> Clique aqui para ver o perfil do personagem ${character.name}`
      )
      .setValue(character.id);

    return option;
  }) satisfies StringSelectMenuOptionBuilder[];

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`characters-menu/:${userId}`)
    .setPlaceholder("> Selecione um personagem para ver o perfil")
    .setMaxValues(1)
    .setMinValues(1)
    .setOptions(options);

  return menu;
}
