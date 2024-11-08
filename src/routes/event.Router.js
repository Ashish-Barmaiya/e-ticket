import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { PrismaClient } from "@prisma/client";
import TicketController from "../controllers/tickets.Controller.js";

const router = express.Router();
const prisma = new PrismaClient();

/// EVENT-HOME PAGE GET ROUTE ///
router.get("/", async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                venueInformation: true,
                host: true
            }
        }); // Use findMany to fetch all events

        // Check if there are any events in the database
        if (!events || events.length === 0) {
            return res.render("eventPages/events", {
                message: "No events available at the moment." // You can customize this message
            });
        }

        // Render events page with event data
        res.render("eventPages/events", {
            events: events // Pass all events to the EJS template
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events." });
    }
});

/// EVENT DETAILS GET ROUTE ///
router.get("/:eventId/details", async (req, res) => {
    console.log('Received request for event ID:', req.params.eventId); // Check if this log appears
    try {
        const { eventId } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: Number(eventId) },
            include: {
                venueInformation: true,
                host: true
            }
        });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.render("eventPages/eventDetails", {
            event: event,
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Error fetching event details" });
    }
});

/// BUY TICKET GET ROUTE ///
router.post("/:eventId/buy-ticket", userLoginAuth, TicketController.buyTicket);

/// PRINT TICKET ROUTE ///
router.get("/ticket/:ticketId", userLoginAuth, TicketController.printTicketDetails);

export default router;