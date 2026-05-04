import { configDotenv } from "dotenv";
import z from "zod";
configDotenv();

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
  CLOUD_NAME: z.string(),
  API_KEY: z.string(),
  API_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
