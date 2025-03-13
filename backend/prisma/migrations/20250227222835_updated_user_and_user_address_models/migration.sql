/*
  Warnings:

  - You are about to drop the column `landmark` on the `UserAddress` table. All the data in the column will be lost.
  - Added the required column `city` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "landmark",
ADD COLUMN     "city" TEXT NOT NULL,
ALTER COLUMN "addressLine2" DROP NOT NULL;
