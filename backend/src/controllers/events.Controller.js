import { PrismaClient } from "@prisma/client";
import { check, validationResult } from "express-validator";
import { redisClient } from "../../app.js";

const prisma = new PrismaClient();

/// EVENT HOME PAGE CONTROLLER //
const eventHomePage = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { status: "Scheduled" },
      include: {
        venueInformation: true,
        host: true,
      },
    });

    if (!events || events.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No events found",
      });
    }

    // return success
    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      events,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Error fetching events." });
  }
};

/// EVENT DETAILS PAGE CONTROLLER //
const eventDetailsPage = async (req, res) => {
  console.log("Received request for event ID:", req.params.eventId);
  try {
    const { eventId } = req.params;

    // Create redis key for event from eventId
    const eventDetailsCacheKey = `event_id:${eventId}`;

    // Check if event details are available in redis cache
    const eventDetailsCachedData = await redisClient.get(eventDetailsCacheKey);

    if (eventDetailsCachedData) {
      return res.status(200).json({
        success: true,
        message: "Fetching data from cache",
        event: JSON.parse(eventDetailsCachedData),
      });
    }

    // If data does not exist on cache, fetch from database
    const event = await prisma.event.findUnique({
      where: { id: Number(eventId) },
      include: {
        venueInformation: true,
        host: true,
      },
    });

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    // Store data in redis for one hour
    await redisClient.setEx(eventDetailsCacheKey, 3600, JSON.stringify(event));

    return res.status(200).json({
      success: true,
      message: "Event details fetched successfully",
      event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching event details" });
  }
};

/// CREATING NEW EVENT ///
const newEvent = async (req, res) => {
  // Validating data using express-validator
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log("Error validating data:", validationErrors.array());
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  // Getting data from the form
  const {
    title,
    description,
    artist,
    // poster,
    venue,
    date,
    startTime,
    endTime,
    totalTickets,
    price,
    userEkycRequired, // get this as boolean from frontend
  } = req.body;

  // Getting Host Id using cookies
  const host = await prisma.hosts.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });

  if (!host) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login",
    });
  }

  // Checking whether host has added venues or not
  const allVenuesOfHost = await prisma.venueInformation.findMany({
    where: { hostId: host.id },
  });

  // If there is no venue added by host, throw an error
  if (allVenuesOfHost.length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "You have not added any Venue. Add Venue before creating an event.",
    });
  }

  // Find the chosen venue from the host's venues using the venue name
  const chosenVenue = allVenuesOfHost.find(
    (venueItem) => venueItem.name === venue,
  );
  if (!chosenVenue) {
    return res.status(400).json({ message: "The chosen venue does not exist" });
  }

  try {
    // Parsing date and time strings into date objects
    const eventDate = new Date(date);
    const datePart = eventDate.toISOString().split("T")[0];
    const eventStartTime = new Date(`${datePart}T${startTime}:00Z`);
    const eventEndTime = endTime
      ? new Date(`${datePart}T${endTime}:00Z`)
      : null;

    // Validating parsed dates
    if (
      isNaN(eventDate.getTime()) ||
      isNaN(eventStartTime.getTime()) ||
      (eventEndTime && isNaN(eventEndTime.getTime()))
    ) {
      console.log("One or more dates are invalid");
      return res
        .status(400)
        .json({ success: false, message: "Invalid date or time format" });
    }

    // Checking if an event at the same dateTime at the same venue already exists
    const existingEvent = await prisma.event.findFirst({
      where: {
        date: eventDate,
        startTime: eventStartTime,
        venueId: chosenVenue.id, // Use the chosen venue's ID
      },
    });
    // If event exists, throw an error
    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message:
          "Event already exists at the same venue at the same date and time",
      });
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

    // Create a new event
    const createNewEvent = await prisma.event.create({
      data: {
        title,
        description,
        artist,
        date: eventDate, // Using the parsed eventDate
        startTime: eventStartTime, // Using the parsed start time
        endTime: eventEndTime, // Using the parsed end time
        ticketsAvailable: parseInt(totalTickets, 10),
        price: parseFloat(price),
        seatsAvailable,
        userEkycRequired,
        host: {
          connect: { id: host.id }, // Connecting the event to the host
        },
        venueInformation: {
          connect: { id: chosenVenue.id }, // Connecting the event to the chosen venue
        },
      },
    });
    // Event creation successful
    console.log("Event created: ", createNewEvent);
    return res.status(201).json({
      success: true,
      message: "New event created successfully",
      event: createNewEvent,
    });
  } catch (error) {
    console.error("Error during event creation: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { newEvent, eventHomePage, eventDetailsPage };
