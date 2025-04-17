-- CreateTable
CREATE TABLE "Quote" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorUsername" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "featuredDate" TIMESTAMP(3),

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedQuote" (
    "id" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "featuredDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeaturedQuote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quote_submittedAt_idx" ON "Quote"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedQuote_quoteId_key" ON "FeaturedQuote"("quoteId");

-- CreateIndex
CREATE INDEX "FeaturedQuote_featuredDate_idx" ON "FeaturedQuote"("featuredDate");

-- AddForeignKey
ALTER TABLE "FeaturedQuote" ADD CONSTRAINT "FeaturedQuote_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "Quote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
