/*
  Warnings:

  - You are about to drop the column `uniqueUserIdentity` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Ticket_uniqueUserIdentity_key";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "uniqueUserIdentity";
