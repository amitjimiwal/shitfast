/*
  Warnings:

  - You are about to drop the column `likes` on the `Quote` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Quote_approved_featured_idx";

-- DropIndex
DROP INDEX "Quote_featuredDate_idx";

-- DropIndex
DROP INDEX "Quote_likes_idx";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "likes";

-- CreateIndex
CREATE INDEX "Quote_submittedAt_idx" ON "Quote"("submittedAt");
