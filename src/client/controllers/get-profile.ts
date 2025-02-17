import { createProfileButtonsRow } from "@/lib/components/profile-buttons-row";
import { createUserCharactersMenu } from "@/lib/components/user-characters-menu";
import { icons } from "@/lib/emojis";
import { joinText } from "@/lib/utils/join-text";
import { GuildsRepository } from "@/repositories/guilds-repository";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { makeFetchUserCharactersUseCase } from "@/use-cases/factories/make-fetch-user-characters-use-case";
import { ActionRowBuilder } from "discord.js";

export interface GetProfileControllerRequest {
  userUsername: string;
  userDiscordId: string;
  userGuildDiscordId: string;
}

export interface GetProfileControllerResponse {
  content: string;
  components: ActionRowBuilder[];
}

export class GetProfileController {
  public constructor(private guildsRepository: GuildsRepository) {}
  public async handle({
    userUsername,
    userDiscordId,
    userGuildDiscordId,
  }: GetProfileControllerRequest): Promise<GetProfileControllerResponse> {
    const fetchUserCharactersUseCase = makeFetchUserCharactersUseCase();
    const { characters } = await fetchUserCharactersUseCase.handle({
      userDiscordId,
    });

    if (!characters.length) throw new ResourceNotFoundError("character");
    const menu = await createUserCharactersMenu(userDiscordId, characters);
    const currentGuild = await this.guildsRepository.findByDiscordId(
      userGuildDiscordId
    );

    const currentCharacterProfile =
      characters.find((character) => character.guild_id === currentGuild?.id) ||
      characters.at(0)!;

    const currentCharacterProfileGuild = (await this.guildsRepository.findById(
      currentCharacterProfile.guild_id
    ))!;

    const currentCharacterMenuOption = menu.options.find(
      (option) => option.data.value === currentCharacterProfile.id
    )!;
    currentCharacterMenuOption.setDefault(true);

    const actionsRow = createProfileButtonsRow(
      userDiscordId,
      currentCharacterProfile
    );

    const menuRow = new ActionRowBuilder<typeof menu>().setComponents(menu);

    const content = joinText(
      `## [ ${icons.static.user} | ${userUsername} ]`,
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

    return { content, components: [menuRow, actionsRow] };
  }
}
