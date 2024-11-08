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
        const seatNumber  = req.body.seatNumber; // Getting seatNumber from frontend
        const userId = req.user.id;  // Getting userId from session
        const eventId = parseInt(req.params.eventId, 10); // Getting eventId from params

        console.log("user is: ", userId);
        console.log("Seat Number is: ", seatNumber);
        
        try {
            // Checking if user is logged in or not
            if (!userId) {
                return res.status(400).json({ message: "User not signed in"})
            } 

            // Fetching event details to get the price
            const event = await prisma.event.findUnique({
                where: { id: eventId },
                select: { price: true },
            });

            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }

            const { price } = event;
            
            // Getting the current max ticket number for the event to increment
            const lastTicket = await prisma.ticket.findFirst({
                where: { eventId: eventId },
                orderBy: { ticketNumber: 'desc' },
            });

            const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;

            // Ensure seatNumber is a string or null
            const validSeatNumber = seatNumber ? String(seatNumber) : null;

            // Checking is seat number is already booked
            const checkSeatNumber = await prisma.ticket.findFirst({
                where: { seatNumber: validSeatNumber}
            })

            if (checkSeatNumber) {
                return res.status(400).json({ message: "Seat already booked"})
            }
            
            // Creating new ticket in the database
            const createdTicket = await prisma.ticket.create({
                data: {
                    ticketNumber: ticketNumber,
                    userId: userId,
                    eventId: eventId,
                    price: price,
                    seatNumber: validSeatNumber,
                },
            });

            console.log("Ticket created successfully:", createdTicket);

            // return res.status(201).json({
            //     message: "Ticket created successfully",
            //     ticket: createdTicket,
            // });
            return res.redirect(`/events//ticket/${createdTicket.id}`)
        } catch (error) {
            console.error("Error creating ticket:", error);
            return res.status(500).json({ message: "Internal server error while creating ticket" });
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