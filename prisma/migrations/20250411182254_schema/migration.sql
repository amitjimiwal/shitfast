/*
  Warnings:

  - You are about to drop the column `score` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `bio` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Quote_score_idx";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "score",
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;
