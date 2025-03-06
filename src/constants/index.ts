import currencies from "./currencies.json";
import tools from "./tools.json";

export type CurrencyId = keyof typeof currencies;
export type ToolId = keyof typeof tools;
export type ItemId = CurrencyId | ToolId;

export { currencies, tools };
