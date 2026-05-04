/*
  Warnings:

  - You are about to drop the column `answer` on the `Solution` table. All the data in the column will be lost.
  - You are about to drop the column `solved` on the `Solution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Solution" DROP COLUMN "answer",
DROP COLUMN "solved";
