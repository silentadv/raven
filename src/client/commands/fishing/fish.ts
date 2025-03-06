import { makeCommand } from "@/lib/factories/make-command";

export default makeCommand({
  name: "fish",
  category: "fishing",
  aliases: ["pescar", "pesca", "fishing"],
  async handle({ message }) {},
});
