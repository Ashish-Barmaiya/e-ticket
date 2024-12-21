// tests/setup.js
const { PrismaClient } = require("@prisma/client");
import env from "dotenv";

env.config({ path: ".env.test" });

if(process.env.NODE_ENV !== "test") {
    throw new Error("Test suite must be run in test environment");
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_url
        }
    }
});

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
