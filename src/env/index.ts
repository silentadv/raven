import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  CLIENT_TOKEN: z.string(),
  DEVELOPER_ID: z.string().default("1318285413957238819"),
  DATABASE_URL: z.string().url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Missing environment variables.");
  throw new Error("Missing environment variables.");
}

export const env = _env.data;
