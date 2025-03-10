import { icons } from "@/lib/emojis";
import { makeEvent } from "@/lib/factories/make-event";
import { parseInteractionId } from "@/lib/utils/parse-interaction-id";
import { Client } from "discord.js";

export default makeEvent({
  name: "interactionCreate",
  handle(client, interaction) {
    if (!interaction.inGuild()) return;
    if (
      !interaction.isButton() &&
      !interaction.isStringSelectMenu() &&
      !interaction.isModalSubmit()
    )
      return;

    const { name, args: argsValues } = parseInteractionId(interaction.customId);
    if (!name) return;

    const component = client.components.get(name);
    if (!component)
      return interaction.reply({
        content: `> ${icons.static.danger} | ${interaction.user} **ocorreu um erro**, nesta **interação** tente novamente **mais tarde**.`,
        flags: ["Ephemeral"],
      });

    const argsKeys = Object.keys(component.schema.shape);
    const argsEntries = argsValues.map((val, idx) => [argsKeys[idx], val]);
    const rawArgs = Object.fromEntries(argsEntries);

    const args = component.schema.safeParse(rawArgs);
    if (!args.success) return console.error(rawArgs, args.error);

    if (args.data?.userId && interaction.user.id !== args.data.userId)
      return interaction.reply({
        content: `> ${icons.static.danger} | ${interaction.user} **ocorreu um erro**, esta **interação** não é pra **você**.`,
        flags: ["Ephemeral"],
      });

    return component.execute({
      args: args.data!,
      interaction,
      client: client as Client<true>,
    });
  },
});
