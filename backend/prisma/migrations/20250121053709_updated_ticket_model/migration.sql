/*
  Warnings:

  - A unique constraint covering the columns `[uniqueUserIdentity]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "uniqueUserIdentity" TEXT,
ADD COLUMN     "userEkycRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_uniqueUserIdentity_key" ON "Ticket"("uniqueUserIdentity");
