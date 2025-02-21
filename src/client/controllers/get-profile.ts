import { createProfileButtonsRow } from "@/lib/components/profile-buttons-row";
import { icons } from "@/lib/emojis";
import { calculateMaxHp } from "@/lib/utils/calculate-max-hp";
import { joinText } from "@/lib/utils/join-text";
import { makeGetProfileUseCase } from "@/use-cases/factories/make-get-profile-use-case";
import { ActionRowBuilder } from "discord.js";

export interface GetProfileControllerRequest {
  userUsername: string;
  userDiscordId: string;
}

export interface GetProfileControllerResponse {
  content: string;
  components: ActionRowBuilder[];
}

export class GetProfileController {
  public constructor() {}
  public async handle({
    userUsername,
    userDiscordId,
  }: GetProfileControllerRequest): Promise<GetProfileControllerResponse> {
    const getProfileUseCase = makeGetProfileUseCase();
    const { user } = await getProfileUseCase.handle({
      userDiscordId,
    });

    const buttonsRow = createProfileButtonsRow(user);

    const userMaxHP = calculateMaxHp(user);
    const content = joinText(
      `## [ ${icons.static.user} | ${userUsername} ]`,
      `> ${icons.static.heart} **| Hp**: \`[${user.hp}/${userMaxHP}]\``,
      `> ${icons.static.sparkles} **| Level**: \`${user.level}\``,
      `> ${icons.static.points} **| Pontos**: \`${user.points}\``,
      `## [ ${icons.static.pin} | Atributos ]`,
      `> ${icons.static.muscule} **| Força**: \`${user.strength}\``,
      `> ${icons.static.fire} **| Magia**: \`${user.magic}\``,
      `> ${icons.static.power} **| Agilidade**: \`${user.agility}\``,
      `> ${icons.static.shield} **| Resistência**: \`${user.resistance}\``
    );

    return { content, components: [buttonsRow] };
  }
}
