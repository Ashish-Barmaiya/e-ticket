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

  // METHOD TO BUY A TICKET (GENERATE A TICKET) //
  static async buyTicket(req, res) {
    try {
      // Get user using refreshToken
      const user = await prisma.user.findFirst({
        where: { refreshToken: req.cookies.refreshToken },
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
            seatsAvailable: true,
          },
        });

        if (!event) {
          throw new Error("Event not found");
        }

        let { ticketsAvailable, price, seatsAvailable } = event;

        if (ticketsAvailable === 0) {
          throw new Error("Tickets sold out.");
        }

        // Ensure seatNumber is a string or null
        const validSeatNumber = seatNumber ? String(seatNumber) : null;

        // Check if the seat number is already booked
        if (!validSeatNumber || !seatsAvailable.includes(validSeatNumber)) {
          throw new Error("Seat already booked or not available");
        }

        // Get the current max ticket number for the event
        const lastTicket = await prisma.ticket.findFirst({
          where: { eventId: eventId },
          orderBy: { ticketNumber: "desc" },
        });

        const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;

        // Update seatsAvailable array removing booked seat number
        const updatedSeatsAvailable = seatsAvailable.filter(
          (seat) => seat !== validSeatNumber,
        );

        // Check eKyc conditions
        /* Condition 1 */
        if (event.userEkycRequired === true && user.eKyc === false) {
          console.log("User eKyc is not completed");
          return res.status(403).send({
            message:
              "User e-Kyc is mandatory to buy tickets of this event. Complete your Aadhaar e-Kyc",
          });
        }
        /* Condition 2 */
        if (event.userEkycRequired === true && user.eKyc === true) {
          // Create the ticket
          const createdTicket = await prisma.ticket.create({
            data: {
              ticketNumber: ticketNumber,
              userId: userId,
              eventId: eventId,
              price: price,
              seatNumber: validSeatNumber,
              userEkycRequired: true,
              uniqueUserIdentity: user.uniqueUserIdentity,
            },
          });
          // Update ticketsAvailable and seatsAvailable
          await prisma.event.update({
            where: { id: eventId },
            data: {
              ticketsAvailable: ticketsAvailable - 1,
              seatsAvailable: updatedSeatsAvailable,
            },
          });

          return createdTicket;
        } else {
          /* Condition 3 - user ekyc not required by the event */
          // Create the ticket
          const createdTicket = await prisma.ticket.create({
            data: {
              ticketNumber: ticketNumber,
              userId: userId,
              eventId: eventId,
              price: price,
              seatNumber: validSeatNumber,
            },
          });

          // Update ticketsAvailable and seatsAvailable
          await prisma.event.update({
            where: { id: eventId },
            data: {
              ticketsAvailable: ticketsAvailable - 1,
              seatsAvailable: updatedSeatsAvailable,
            },
          });

          return createdTicket;
        }
      });

      console.log("Ticket created successfully:", result);
      // return res.redirect(`/events/ticket/${result.id}`);
      return res.status(200).json({
        success: true,
        message: "Ticket purchased successfully",
        ticket: result,
      });
    } catch (error) {
      console.error("Error creating ticket:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  // METHOD TO PRINT BOOKED TICKET DETAILS //
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
        userEkycRequired: ticket.userEkycRequired,
        uniqueUserIdentity: ticket.uniqueUserIdentity || null,
        eventName: ticket.event.title,
        eventId: ticket.event.id,
        venueName: ticket.event.venueInformation.name,
        eventAddress: ticket.event.venueInformation.address,
        eventDateTime: `${ticket.event.date.toDateString()} at ${ticket.event.startTime.toTimeString().slice(0, 5)}`,
        seatNumber: ticket.seatNumber,
        price: ticket.price,
      };

      console.log("Ticket Details:", formattedDetails);

      return res.status(200).send({
        message: "Ticket details retrieved successfully",
        ticket: formattedDetails,
      });
    } catch (error) {
      console.error("Error retrieving ticket details:", error);
      return res.status(500).json({
        message: "Internal server error while retrieving ticket details",
      });
    }
  }

  // METHOD TO CANCEL TICKET //
  static async cancelTicket(req, res) {
    try {
      // Identify which ticket to cancel through req
      const { ticketId } = req.params;
      const { email, reason } = req.body;

      // Get user using cookies
      const user = await prisma.user.findFirst({
        where: { refreshToken: req.cookies.refreshToken },
      });

      if (!user) {
        return res.status(401).json({ message: "User not signed in" });
      }

      if (email !== user.email) {
        return res.status(400).json({ message: "Email does not match" });
      }

      const result = await prisma.$transaction(async (prisma) => {
        // Fetch ticket with event details
        const ticket = await prisma.ticket.findUnique({
          where: { id: ticketId },
          include: { event: true },
        });

        if (!ticket) {
          throw new Error("Ticket not found");
        }

        // Check if ticket has already been cancelled
        if (ticket.status === "cancelled") {
          throw new Error("Ticket is already cancelled");
        }

        // create new record in ticketCancellations table
        await prisma.ticketCancellations.create({
          data: {
            ticketId: ticket.id,
            userId: ticket.userId,
            eventId: ticket.eventId,
            seatsCancelled: ticket.seatNumber,
            canceledAt: new Date(),
            reason: reason || null,
            refund: ticket.event.price || null,
          },
        });

        // Update ticket status
        await prisma.ticket.update({
          where: { id: ticketId },
          data: {
            status: "cancelled",
            canceledAt: new Date(),
          },
        });

        // Update event table adding above updated values
        await prisma.event.update({
          where: { id: ticket.event.id },
          data: {
            seatsAvailable: { push: ticket.seatNumber },
            ticketsAvailable: { increment: 1 },
          },
        });

        return { ticketId: ticket.id, eventId: ticket.event.id };
      });

      return res.status(200).json({
        success: true,
        message: "Ticket successfully cancelled",
        result,
      });
    } catch (error) {
      console.log("Error cancelling ticket: ", error.message);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default TicketController;
