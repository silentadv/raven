import { ItemId, tools } from "@/constants";
import { icons } from "@/lib/emojis";
import { makeCommand } from "@/lib/factories/make-command";
import { joinText } from "@/lib/utils/join-text";
import { makeFetchItemsUseCase } from "@/use-cases/factories/make-fetch-items-use-case";
import { makeItemMenu } from "@raven-ui/menus/item-menu";
import { ActionRowBuilder } from "discord.js";

export default makeCommand({
  name: "fish",
  category: "fishing",
  aliases: ["pescar", "pesca", "fishing"],
  async handle({ message }) {
    const fetchItemsUseCase = makeFetchItemsUseCase();
    const { items } = await fetchItemsUseCase.handle({
      userDiscordId: message.author.id,
    });

    const validTools = Object.values(tools).filter(
      (tool) => tool.id.endsWith("_rod") || tool.id.endsWith("_bait")
    );

    const userValidTools = items.filter(
      (item) =>
        validTools.find((tool) => tool.id === item.item_id) && item.count > 0
    );

    const userHasRod = userValidTools.find((tool) =>
      tool.item_id.endsWith("_rod")
    );
    const userHasBait = userValidTools.find((tool) =>
      tool.item_id.endsWith("_bait")
    );

    if (!userHasRod || !userHasBait)
      return message.reply(
        joinText(
          `> ${icons.static.danger} | ${message.author} ocorreu um **erro**, você **não possui** os **itens necessários** para **iniciar** uma **sessão de pesca**`,
          `> -# Você precisa de uma **isca** e uma **vara de pesca** para pescar.`
        )
      );

    const itemOptions = userValidTools.map((tool) => ({
      name: `x${tool.count} ${tools[tool.item_id as keyof typeof tools].name}`,
      id: tool.item_id as ItemId,
    }));

    const menu = makeItemMenu(
      `start-fishing/:${message.author.id}`,
      itemOptions,
      2,
      2
    );

    const row = new ActionRowBuilder<typeof menu>().setComponents(menu);

    message.reply({
      content: `> ${icons.static.info} | ${message.author}, selecione uma isca e uma vara de pesca para iniciar sua sessão de pesca.`,
      components: [row],
    });
  },
});
