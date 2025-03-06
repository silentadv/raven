import { MainShopController } from "@/controllers/economy/main-shop-controller";
import { makeCommand } from "@/lib/factories/make-command";

export default makeCommand({
  name: "shop",
  aliases: ["loja", "mercado", "market"],
  category: "economy",
  async handle({ message }) {
    const mainShopController = new MainShopController();
    const response = await mainShopController.handle({
      userDiscordId: message.author.id,
    });

    return message.reply(response);
  },
});
