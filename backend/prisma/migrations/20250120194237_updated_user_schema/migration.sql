/*
  Warnings:

  - The `emailVerification` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[aadhaarPhoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aadhaarPhoneNumber" TEXT,
ADD COLUMN     "phoneVerification" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "dateOfBirth" SET DATA TYPE TEXT,
DROP COLUMN "emailVerification",
ADD COLUMN     "emailVerification" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_aadhaarPhoneNumber_key" ON "User"("aadhaarPhoneNumber");
