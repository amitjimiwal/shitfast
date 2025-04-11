/*
  Warnings:

  - You are about to drop the column `likes` on the `FeaturedQuote` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `FeaturedQuote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[quoteId]` on the table `FeaturedQuote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FeaturedQuote_likes_idx";

-- AlterTable
ALTER TABLE "FeaturedQuote" DROP COLUMN "likes",
DROP COLUMN "score",
ALTER COLUMN "featuredDate" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedQuote_quoteId_key" ON "FeaturedQuote"("quoteId");

-- CreateIndex
CREATE INDEX "Quote_score_idx" ON "Quote"("score");
