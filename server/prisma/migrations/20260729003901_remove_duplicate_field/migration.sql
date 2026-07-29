/*
  Warnings:

  - You are about to drop the column `nameLower` on the `Tag` table. All the data in the column will be lost.

*/
-- CreateExtension
  CREATE EXTENSION IF NOT EXISTS "citext";

-- DropIndex
DROP INDEX "Tag_nameLower_key";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "nameLower",
ALTER COLUMN "name" SET DATA TYPE CITEXT;
