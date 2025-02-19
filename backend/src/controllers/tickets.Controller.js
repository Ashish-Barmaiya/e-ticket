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
    let result;

    // Get user using refreshToken
    const user = await prisma.user.findFirst({
      where: { refreshToken: req.cookies.refreshToken },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized. Please login" });
    }

    const totalTickets = parseInt(req.body.totalSeats);
    const UserEnteredSeatNumbers = req.body.seatNumber;
    const userId = user.id;
    const eventId = parseInt(req.params.eventId, 10);

    try {
      result = await prisma.$transaction(async (prisma) => {
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

        if (event.ticketsAvailable === 0) {
          return res.status(404).json({
            success: false,
            message: "Tickets sold out",
          });
        }

        // Check if enough tickets are available
        if (event.ticketsAvailable < totalTickets) {
          return res.status(400).json({
            success: false,
            message: "Not enough tickets available",
          });
        }

        let assignedSeatNumbers = [];

        if (!UserEnteredSeatNumbers || UserEnteredSeatNumbers.length === 0) {
          // Assign seats in ascending order
          assignedSeatNumbers = event.seatsAvailable.slice(0, totalTickets);
        } else {
          // Validate provided seat numbers
          const invalidSeats = UserEnteredSeatNumbers.filter(
            (seat) => !event.seatsAvailable.includes(seat),
          );

          if (invalidSeats.length > 0) {
            return res.status(400).json({
              success: false,
              message: `The following seats are not available: ${invalidSeats.join(
                ", ",
              )}`,
            });
          }
          assignedSeatNumbers = UserEnteredSeatNumbers;
        }

        // Check eKyc conditions
        /* Condition 1 */
        if (event.userEkycRequired === true && user.eKyc === false) {
          console.log("User eKyc is not completed");
          return res.status(403).send({
            success: false,
            message:
              "User e-Kyc is mandatory to buy tickets of this event. Complete your Aadhaar e-Kyc",
          });
        }
        /* Condition 2 */
        if (event.userEkycRequired === true && user.eKyc === true) {
          // Create the ticket
          let createdTickets = [];
          for (let i = 0; i < totalTickets; i++) {
            const seatNumber = assignedSeatNumbers[i];

            // Get the current max ticket number for the event
            const lastTicket = await prisma.ticket.findFirst({
              where: { eventId: eventId },
              orderBy: { ticketNumber: "desc" },
            });

            const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;
            const createdTicket = await prisma.ticket.create({
              data: {
                ticketNumber: ticketNumber,
                userId: userId,
                eventId: eventId,
                price: event.price,
                seatNumber: seatNumber,
                userEkycRequired: true,
                uniqueUserIdentity: user.uniqueUserIdentity,
              },
            });
            createdTickets.push(createdTicket);
          }

          // Update seatsAvailable array removing booked seat number
          const updatedSeatsAvailable = event.seatsAvailable.filter(
            (seat) => !assignedSeatNumbers.includes(seat),
          );

          // Update ticketsAvailable and seatsAvailable
          await prisma.event.update({
            where: { id: eventId },
            data: {
              ticketsAvailable: event.ticketsAvailable - 1,
              seatsAvailable: updatedSeatsAvailable,
            },
          });

          return createdTickets;
        } else {
          /* Condition 3 - user ekyc not required by the event */
          // Create tickets
          let createdTickets = [];
          for (let i = 0; i < totalTickets; i++) {
            const seatNumber = assignedSeatNumbers[i];

            // Get the current max ticket number for the event
            const lastTicket = await prisma.ticket.findFirst({
              where: { eventId: eventId },
              orderBy: { ticketNumber: "desc" },
            });

            const ticketNumber = lastTicket ? lastTicket.ticketNumber + 1 : 1;

            const createdTicket = await prisma.ticket.create({
              data: {
                ticketNumber: ticketNumber,
                userId: userId,
                eventId: eventId,
                price: event.price,
                seatNumber: seatNumber,
              },
            });
            createdTickets.push(createdTicket);
          }

          // Update event's ticketsAvailable and seatsAvailable
          const updatedSeatsAvailable = event.seatsAvailable.filter(
            (seat) => !assignedSeatNumbers.includes(seat),
          );

          await prisma.event.update({
            where: { id: eventId },
            data: {
              ticketsAvailable: event.ticketsAvailable - totalTickets,
              seatsAvailable: updatedSeatsAvailable,
            },
          });

          return createdTickets;
        }
      });

      console.log("Tickets created successfully:", result);
      return res.status(201).json({
        success: true,
        message: "Tickets purchased successfully",
        ticket: result,
      });
    } catch (error) {
      console.error("Error occurred after transaction commit:", error);

      // Cleanup: if tickets were created, update event and delete created tickets
      if (result && Array.isArray(result) && result.length > 0) {
        try {
          // Extract seatNumbers from created tickets
          const seatNumbersToAddBack = result.map(
            (ticket) => ticket.seatNumber,
          );

          // Fetch event's current data
          const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { seatsAvailable: true, ticketsAvailable: true },
          });

          if (event) {
            // Merge booked seatNumbers back into availableSeats
            const newSeatsAvailable = Array.from(
              new Set([...event.seatsAvailable, ...seatNumbersToAddBack]),
            );

            // Restore the ticketsAvailable count adding back the number of tickets created
            const updatedTicketsAvailable =
              event.ticketsAvailable + result.length;

            // Update event record
            await prisma.event.update({
              where: { id: eventId },
              data: {
                seatsAvailable: newSeatsAvailable,
                ticketsAvailable: updatedTicketsAvailable,
              },
            });
          }

          // Delete the created tickets
          await prisma.ticket.deleteMany({
            where: {
              id: { in: result.map((ticket) => ticket.id) },
            },
          });

          console.log(
            "Cleaned up orphaned tickets and updated seatsAvailable.",
          );
        } catch (error) {
          console.error("Error cleaning up orphaned tickets:", cleanupError);
        }
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error, cleanup attempted.",
      });
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
      // Identify which ticket to cancel
      const { ticketId, reason } = req.body;

      // Get user using cookies
      const user = await prisma.user.findFirst({
        where: { refreshToken: req.cookies.refreshToken },
      });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not signed in" });
      }

      // if (email !== user.email) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Email does not match" });
      // }

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
        message: "Ticket cancelled successfully",
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
