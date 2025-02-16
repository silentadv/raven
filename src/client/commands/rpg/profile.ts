import { createUserCharactersMenu } from "@/lib/components/user-characters-menu";
import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { PrismaGuildsRepository } from "@/repositories/prisma/prisma-guilds-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { makeFetchUserCharactersUseCase } from "@/use-cases/factories/make-fetch-user-characters-use-case";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export default makeCommand({
  name: "profile",
  category: "rpg",
  aliases: ["perfil"],
  async handle({ message }) {
    const fetchUserCharactersUseCase = makeFetchUserCharactersUseCase();
    const { characters } = await fetchUserCharactersUseCase.handle({
      userDiscordId: message.author.id,
    });

    if (!characters.length) throw new ResourceNotFoundError("character");

    const menu = await createUserCharactersMenu(message.author.id, characters);
    const guildsRepository = new PrismaGuildsRepository();
    const currentGuild = await guildsRepository.findByDiscordId(
      message.guild.id
    );

    const currentCharacterProfile =
      characters.find((character) => character.guild_id === currentGuild?.id) ||
      characters.at(0)!;

    const currentCharacterProfileGuild = (await guildsRepository.findById(
      currentCharacterProfile.guild_id
    ))!;

    const currentCharacterMenuOption = menu.options.find(
      (option) => option.data.value === currentCharacterProfile.id
    )!;
    currentCharacterMenuOption.setDefault(true);

    const editCharacterButton = new ButtonBuilder()
      .setCustomId(
        `edit-character/:${message.author.id}/:${currentCharacterProfile.id}`
      )
      .setEmoji(icons.static.pencil.id)
      .setLabel("| Editar Personagem")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const allocateCharacterPointsButton = new ButtonBuilder()
      .setCustomId(
        `up-character/:${message.author.id}/:${currentCharacterProfile.id}`
      )
      .setEmoji(icons.static.points.id)
      .setLabel("| Utilizar Pontos")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true);

    const actionsRow = new ActionRowBuilder<ButtonBuilder>().setComponents(
      editCharacterButton,
      allocateCharacterPointsButton
    );

    const menuRow = new ActionRowBuilder<typeof menu>().setComponents(menu);

    const content = joinText(
      `## [ ${icons.static.user} | ${message.author.username} ]`,
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

    message.reply({ content, components: [menuRow, actionsRow] });
  },
});
