-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active';

-- AlterTable
ALTER TABLE "VenueInformation" ALTER COLUMN "seatingCategories" SET DATA TYPE TEXT,
ALTER COLUMN "seatingLayout" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "TicketCancellations" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "canceledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "refund" DOUBLE PRECISION,

    CONSTRAINT "TicketCancellations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TicketCancellations_ticketId_key" ON "TicketCancellations"("ticketId");

-- CreateIndex
CREATE INDEX "TicketCancellations_canceledAt_idx" ON "TicketCancellations"("canceledAt");

-- CreateIndex
CREATE INDEX "Ticket_userId_idx" ON "Ticket"("userId");

-- CreateIndex
CREATE INDEX "Ticket_eventId_idx" ON "Ticket"("eventId");

-- AddForeignKey
ALTER TABLE "TicketCancellations" ADD CONSTRAINT "TicketCancellations_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
