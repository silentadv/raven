import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { ResourceNotFoundError } from "@/use-cases/errors/ResourceNotFoundError";
import { makeCharacterInspectItemUseCase } from "@/use-cases/factories/make-character-inspect-item-use-case";
import { makeGetGuildCharacterProfileUseCase } from "@/use-cases/factories/make-get-guild-character-profile-use-case";

export default makeCommand({
  name: "balance",
  category: "economy",
  aliases: ["bal", "prismas", "currency"],
  async handle({ message }) {
    const getGuildCharacterProfileUseCase =
      makeGetGuildCharacterProfileUseCase();

    const { character } = await getGuildCharacterProfileUseCase.handle({
      guildDiscordId: message.guild.id,
      userDiscordId: message.author.id,
    });

    const characterInspectItemUseCase = makeCharacterInspectItemUseCase();

    let characterPrismasCount = 0;
    try {
      const { item } = await characterInspectItemUseCase.handle({
        itemId: "prisma",
        characterId: character.id,
      });

      characterPrismasCount = item.count;
    } catch (error) {
      if (error instanceof ResourceNotFoundError && error.resource !== "item")
        throw error;
    }

    return message.reply(
      joinText(
        `> ${icons.static.backpack} | ${message.author}, você **possui** em seu **inventário** \`${characterPrismasCount}\` **[ ${icons.static.prisma} | Prismas ]**.`,
        `> -# Utilize **r.daily** para **coletar** sua **recompensa diária**`
      )
    );
  },
});
