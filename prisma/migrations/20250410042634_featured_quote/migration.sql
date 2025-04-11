-- CreateTable
CREATE TABLE "FeaturedQuote" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "featuredDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FeaturedQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeaturedQuote_featuredDate_idx" ON "FeaturedQuote"("featuredDate");

-- CreateIndex
CREATE INDEX "FeaturedQuote_likes_idx" ON "FeaturedQuote"("likes");

-- AddForeignKey
ALTER TABLE "FeaturedQuote" ADD CONSTRAINT "FeaturedQuote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
