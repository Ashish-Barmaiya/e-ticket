/*
  Warnings:

  - You are about to drop the column `poster` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "poster",
ADD COLUMN     "bannerImage" TEXT,
ADD COLUMN     "posterImage" TEXT;
