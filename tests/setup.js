// tests/setup.js
import { PrismaClient } from "@prisma/client";
import env from "dotenv";

env.config({ path: ".env.test" });

const prisma = new PrismaClient();

// Clean up database before tests //
beforeAll(async () => {
    await prisma.$connect();
    
// Transaction to ensure atomic cleanup
    await prisma.$transaction([
        prisma.userAddress.deleteMany(),
        prisma.ticketCancellations.deleteMany(),
        prisma.ticket.deleteMany(),
        prisma.event.deleteMany(),
        prisma.venueInformation.deleteMany(),
        prisma.user.deleteMany(),
        prisma.hosts.deleteMany()
    ]);
});

// Clean up and disconnect after tests //
afterAll(async () => {
    await prisma.$disconnect();
});
