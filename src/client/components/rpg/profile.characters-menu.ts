import { ComponentType } from "@/@types/component";
import { createUserCharactersMenu } from "@/lib/components/user-characters-menu";
import { icons } from "@/lib/emojis";
import { makeComponent } from "@/lib/factories/make-component";
import { joinText } from "@/lib/utils/join-text";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { makeFetchUserCharactersUseCase } from "@/use-cases/factories/make-fetch-user-characters-use-case";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { z } from "zod";

export default makeComponent({
  id: "characters-menu/:userId",
  name: "characters-menu",
  types: [ComponentType.StringSelectMenu],
  schema: z.object({
    userId: z.coerce.string(),
  }),
  async execute({ interaction, args: { userId } }) {
    const fetchUserCharactersUseCase = makeFetchUserCharactersUseCase();
    const { characters } = await fetchUserCharactersUseCase.handle({
      userDiscordId: userId,
    });

    if (!characters.length) throw new ResourceNotFoundError("character");

    const menu = await createUserCharactersMenu(userId, characters);
    const guildsRepository = new PrismaGuildsRepository();

    const currentCharacterProfile = characters.find(
      (character) => character.id === interaction.values[0]
    )!;

    const currentCharacterProfileGuild = (await guildsRepository.findById(
      currentCharacterProfile.guild_id
    ))!;

    const currentCharacterMenuOption = menu.options.find(
      (option) => option.data.value === currentCharacterProfile.id
    )!;
    currentCharacterMenuOption.setDefault(true);

    const editCharacterButton = new ButtonBuilder()
      .setCustomId(
        `edit-character/:${interaction.user.id}/:${currentCharacterProfile.id}`
      )
      .setEmoji(icons.static.pencil.id)
      .setLabel("| Editar Personagem")
      .setStyle(ButtonStyle.Primary);

    const allocateCharacterPointsButton = new ButtonBuilder()
      .setCustomId(
        `up-character/:${interaction.user.id}/:${currentCharacterProfile.id}`
      )
      .setEmoji(icons.static.points.id)
      .setLabel("| Utilizar Pontos")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(currentCharacterProfile.points <= 0);

    const reloadProfileButton = new ButtonBuilder()
      .setCustomId(
        `reload-character/:${interaction.user.id}/:${currentCharacterProfile.id}`
      )
      .setEmoji(icons.static.reload.id)
      .setStyle(ButtonStyle.Primary);

    const actionsRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      editCharacterButton,
      allocateCharacterPointsButton,
      reloadProfileButton
    );

    const row = new ActionRowBuilder<typeof menu>().setComponents(menu);
    const content = joinText(
      `## [ ${icons.static.user} | ${interaction.user.username} ]`,
      `> ${icons.static.info} **| Nome**: \`${currentCharacterProfile.name}\``,
      `> ${icons.static.guild} **| Guilda**: \`${currentCharacterProfileGuild.name}\``,
      `> ${icons.static.sparkles} **| Level**: \`${currentCharacterProfile.level}\``,
      `> ${icons.static.points} **| Pontos**: \`${currentCharacterProfile.points}\``,
      `## [ ${icons.static.pin} | Atributos ]`,
      `> ${icons.static.muscule} **| Força**: \`${currentCharacterProfile.strength}\``,
      `> ${icons.static.fire} **| Magia**: \`${currentCharacterProfile.magic}\``,
      `> ${icons.static.power} **| Agilidade**: \`${currentCharacterProfile.agility}\``,
      `> ${icons.static.shield} **| Resistência**: \`${currentCharacterProfile.resistance}\``
    );

    interaction.update({ content, components: [row, actionsRow] });
  },
});
