import { PrismaPg } from "@prisma/adapter-pg";
import { configDotenv } from "dotenv";
import { PrismaClient } from "../../generated/prisma/client";
configDotenv();

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });