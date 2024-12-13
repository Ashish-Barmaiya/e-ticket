import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

/// EVENT HOME PAGE CONTROLLER //
const eventHomePage = async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            include: {
                venueInformation: true,
                host: true
            }
        });

        // Checking if there are any events in the database
        if (!events || events.length === 0) {
            return res.render("eventPages/events", {
                message: "No events available at the moment." // You can customize this message
            });
        }

        // Rendering events page with event data
        res.render("eventPages/events", {
            events: events // Passing all events to the EJS template
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error fetching events." });
    }
};

/// EVENT DETAILS PAGE CONTROLLER //
const eventDetailsPage = async (req, res) => {
    console.log('Received request for event ID:', req.params.eventId); // Check if this log appears
    try {
        const { eventId } = req.params;
        // Checking for the event
        const event = await prisma.event.findUnique({
            where: { id: Number(eventId) },
            include: {
                venueInformation: true,
                host: true
            }
        });
        // If event does not exits
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Rendering event-details template
        res.render("eventPages/eventDetails", {
            event: event,
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Error fetching event details" });
    }
}

/// CREATING NEW EVENT ///
const newEvent = async (req, res) => {
    // Validating data using express-validator
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log("Error validating data:", validationErrors.array());
        return res.status(400).json({ errors: validationErrors.array() });
    }
    // Getting data from the form
    const { 
        title,
        description, 
        artist, 
        poster, 
        venue,
        date,
        startTime, 
        endTime, 
        totalTickets, 
        price 
    } = req.body;

    // Getting Host Id using cookies
    const host = await prisma.hosts.findFirst({
        where: { refreshToken: req.cookies.refreshToken }
    });

    // Checking whether host has added venues or not
    const checkVenue = await prisma.venueInformation.findFirst({
        where: { hostId: host.id }
    });

    // If there is no venue added by host, throw an error
    if (!checkVenue) {
        console.error("Cannot find any venue listed under this host. Host has not added any venue yet.");
        return res.status(400).json({ message: "You have not added any Venue. Add Venue before creating an event."})
    }

    // If venues has been added by the host, check further whether the venue chosen by host exits or not
    if (venue !== checkVenue.name) {
        // If venue does not match with the one chosen by the host, throw an error
        console.error("Venue does not match");
        return res.status(404).json({ message: "Venue does not match" });
    }

    // If venue matches, proceed further
    console.log(`Venue name provided by user matched venue name in database. Venue Name is ${venue}, Venue in database is ${checkVenue.name}. Venue id is ${checkVenue.id}`);

    try {
        // Parsing date and time strings into date objects
        const eventDate = new Date(date);
        const datePart = eventDate.toISOString().split("T")[0];
        const eventStartTime = new Date(`${datePart}T${startTime}:00Z`);
        const eventEndTime = endTime ? new Date(`${datePart}T${endTime}:00Z`) : null;

        // Validating parsed dates
        if (isNaN(eventDate.getTime()) || isNaN(eventStartTime.getTime()) || (eventEndTime && isNaN(eventEndTime.getTime()))) {
            console.log("One or more dates are invalid");
            return res.status(400).json({ message: "Invalid date or time format" });
        }
        // Checking if an event at the same dateTime at the same venue already exists
        const existingEvent = await prisma.event.findFirst({
            where: {
                date: eventDate,
                startTime: eventStartTime,
                venueId: checkVenue.id,
            }
        });
        // If event exists, throw an error
        if (existingEvent) {
            console.error("Event already exists:", existingEvent);
            return res.status(400).json({ message: "Event already exists at the same venue at the same date and time" });
        }

        // Function to convert totalTickets into individual seat numbers
        async function convertTicketToSeat(totalTickets) {
            const seatsAvailable = [];

            for (let i = 1; i <= totalTickets; i++) {
                seatsAvailable.push(i.toString());
            }

            return seatsAvailable;
        }
        const seatsAvailable = await convertTicketToSeat(totalTickets);

        // If not, proceed to create a new event
        const createNewEvent = await prisma.event.create({
            data: {
                title,
                description, 
                artist,
                poster,
                date: eventDate, // Using the parsed eventDate
                startTime: eventStartTime, // Using the parsed start time
                endTime: eventEndTime, // Using the parsed end time
                ticketsAvailable: parseInt(totalTickets, 10),
                price: parseFloat(price),
                seatsAvailable,
                host: {
                    connect: { id: host.id } // Connecting the event to the host
                },
                venueInformation: {
                    connect: { id: checkVenue.id } // Conncecting the event to the venue
                },
            }
        });
        // Event creation successfull
        console.log("Event created: ", createNewEvent);
        return res.status(201).json({ message: "New event created successfully", event: createNewEvent });
        
    } catch (error) {
        console.error("Error during event creation: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { 
    newEvent,
    eventHomePage,
    eventDetailsPage
 };