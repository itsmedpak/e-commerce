-- CreateTable
CREATE TABLE "SyncOperation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "SyncOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyncOperation_userId_idx" ON "SyncOperation"("userId");

-- CreateIndex
CREATE INDEX "SyncOperation_entityId_idx" ON "SyncOperation"("entityId");

-- CreateIndex
CREATE INDEX "SyncOperation_createdAt_idx" ON "SyncOperation"("createdAt");

-- AddForeignKey
ALTER TABLE "SyncOperation" ADD CONSTRAINT "SyncOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
