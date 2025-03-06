import { CommandOptions } from "@/types/command";

export function makeCommand<T>(options: CommandOptions<T>) {
  return options;
}
