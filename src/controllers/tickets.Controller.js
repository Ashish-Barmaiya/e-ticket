import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TicketController {
    // Constructor to initialize necessary values
    constructor(userId, eventId, price, seatNumber = null) {
        this.userId = userId;
        this.eventId = eventId;
        this.price = price;
        this.seatNumber = seatNumber;
    }

    // Method to buy a ticket (generate a new ticket)
    static async buyTicket(req, res) {
        try {
            // Get user using refreshToken
            const user = await prisma.user.findFirst({
                where: { refreshToken: req.cookies.refreshToken }
            });
    
            if (!user) {
                return res.status(400).json({ message: "User not signed in" });
            }
    
            const seatNumber = req.body.seatNumber; // Getting seatNumber from frontend
            const userId = user.id; // Getting userId from user object
            const eventId = parseInt(req.params.eventId, 10); // Getting eventId from params
    
            const result = await prisma.$transaction(async (prisma) => {
                // Fetching event details to get the price and ticketsAvailable
                const event = await prisma.event.findUnique({
                    where: { id: eventId },
                    select: {
                        price: true,
                        ticketsAvailable: true,
                    },
                });
    
                if (!event) {
                    throw new Error("Event not found");
                }
    
                let { ticketsAvailable, price } = event;
    
                if (ticketsAvailable === 0) {
                    throw new Error("Tickets sold out.");
                }
    
                // Ensure seatNumber is a string or null
                const validSeatNumber = seatNumber ? String(seatNumber) : null;
    
                // Check if the seat number is already booked
                if (validSeatNumber) {
                    const checkSeatNumber = await prisma.ticket.findFirst({
                        where: {
                            seatNumber: validSeatNumber,
                            eventId: eventId,
                        },
                    });
    
                    if (checkSeatNumber) {
                        throw new Error("Seat already booked");
                    }
                }
    
                // Get the current max ticket number for the event
                const lastTicket = await prisma.ticket.findFirst({
                    where: { eventId: eventId },
                    orderBy: { ticketNumber: "desc" },
                });
    
                const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;
    
                // Create the ticket and update available tickets atomically
                const createdTicket = await prisma.ticket.create({
                    data: {
                        ticketNumber: ticketNumber,
                        userId: userId,
                        eventId: eventId,
                        price: price,
                        seatNumber: validSeatNumber,
                    },
                });
    
                // Decrement ticketsAvailable in the same transaction
                await prisma.event.update({
                    where: { id: eventId },
                    data: { ticketsAvailable: ticketsAvailable - 1 },
                });
    
                return createdTicket;
            });
    
            console.log("Ticket created successfully:", result);
            return res.redirect(`/events/ticket/${result.id}`);
            
        } catch (error) {
            console.error("Error creating ticket:", error.message);
            return res.status(400).json({ message: error.message });
        }
    }
        
    // Method to get formatted ticket details
    static async printTicketDetails(req, res) {
        const { ticketId } = req.params;
        console.log("ticket ID: ", ticketId);

        try {
            // Fetch ticket with user and event details
            const ticket = await prisma.ticket.findFirst({
                where: { id: ticketId },
                include: {
                    user: {
                        select: {
                            fullName: true,
                        },
                    },
                    event: {
                        select: {
                            title: true,
                            date: true,
                            startTime: true,
                            venueInformation: {
                                select: {
                                    name: true,
                                    address: true,
                                },
                            },
                        },
                    },
                },
            });

            console.log("Ticket fetched: ", ticket);
            
            if (!ticket) {
                return res.status(404).json({ message: "Ticket not found" });
            }

            // Format ticket details
            const formattedDetails = {
                ticketNumber: ticket.ticketNumber,
                userName: ticket.user.fullName,
                eventName: ticket.event.title,
                venueName: ticket.event.venueInformation.name,
                eventAddress: ticket.event.venueInformation.address,
                eventDateTime: `${ticket.event.date.toDateString()} at ${ticket.event.startTime.toTimeString().slice(0, 5)}`,
                seatNumber: ticket.seatNumber,
                price: ticket.price,
            };

            console.log("Formatted Ticket Details:", formattedDetails);
            
            return res.status(200).json({
                message: "Ticket details retrieved successfully",
                ticket: formattedDetails,
            });
            
        } catch (error) {
            console.error("Error retrieving ticket details:", error);
            return res.status(500).json({ message: "Internal server error while retrieving ticket details" });
        }
    }
}

export default TicketController;