/*
  Warnings:

  - The `phone` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[uniqueUserIdentity]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eKyc" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerification" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "uniqueUserIdentity" TEXT,
DROP COLUMN "phone",
ADD COLUMN     "phone" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueUserIdentity_key" ON "User"("uniqueUserIdentity");
