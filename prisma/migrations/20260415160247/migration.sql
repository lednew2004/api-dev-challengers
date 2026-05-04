/*
  Warnings:

  - Added the required column `level` to the `Challenger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validated_at` to the `Solution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Level" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "Challenger" ADD COLUMN     "level" "Level" NOT NULL;

-- AlterTable
ALTER TABLE "Solution" ADD COLUMN     "validated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "challengerId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechsSuggested" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "challengerId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechsSuggested_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialLinks" ADD CONSTRAINT "SocialLinks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirements" ADD CONSTRAINT "Requirements_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "Challenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechsSuggested" ADD CONSTRAINT "TechsSuggested_challengerId_fkey" FOREIGN KEY ("challengerId") REFERENCES "Challenger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
