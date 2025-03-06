import emojis from "./emojis.json";
import { formatEmoji } from "discord.js";

export interface Emoji {
  id: string;
  animated: boolean;
  name: string;
  toString(): string;
}

export type EmojiList = typeof emojis;

export interface EmojiObject {
  animated: Record<keyof EmojiList["animated"], Emoji>;
  static: Record<keyof EmojiList["static"], Emoji>;
}

function loadEmojis(): EmojiObject {
  return Object.keys(emojis).reduce(
    (acc, type) => {
      const isAnimated = type === "animated";

      //@ts-ignore
      acc[type] = Object.fromEntries(
        Object.entries(emojis[type as keyof EmojiList]).map(([name, id]) => [
          name,
          {
            id,
            animated: isAnimated,
            name,
            toString: () => formatEmoji(id, isAnimated),
          } as Emoji,
        ])
      );

      return acc;
    },
    { animated: {}, static: {} } as EmojiObject
  );
}

export const icons = loadEmojis();
