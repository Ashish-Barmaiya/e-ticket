/*
  Warnings:

  - Added the required column `eventId` to the `TicketCancellations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TicketCancellations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "seatsAvailable" TEXT[];

-- AlterTable
ALTER TABLE "TicketCancellations" ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "seatsCancelled" TEXT[],
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TicketCancellations" ADD CONSTRAINT "TicketCancellations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCancellations" ADD CONSTRAINT "TicketCancellations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
