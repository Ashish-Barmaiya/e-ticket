import { PrismaClient } from "@prisma/client";
import { check, validationResult } from "express-validator";
import { redisClient } from "../../app.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  // Validate data using express-validator
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    console.log("Error validating data:", validationErrors.array());
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  // Extract form data from req.body
  const {
    title,
    description,
    artist,
    venue,
    date,
    startTime,
    endTime,
    totalTickets,
    price,
    userEkycRequired,
  } = req.body;

  // Get host using refreshToken from cookies
  const host = await prisma.hosts.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });
  if (!host) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login",
    });
  }

  // Fetch all venues of the host
  const allVenuesOfHost = await prisma.venueInformation.findMany({
    where: { hostId: host.id },
  });
  if (allVenuesOfHost.length === 0) {
    return res.status(400).json({
      success: false,
      message:
        "You have not added any Venue. Add Venue before creating an event.",
    });
  }

  // Find the chosen venue by its name
  const chosenVenue = allVenuesOfHost.find(
    (venueItem) => venueItem.name === venue,
  );
  if (!chosenVenue) {
    return res
      .status(400)
      .json({ success: false, message: "The chosen venue does not exist" });
  }

  try {
    // Get files from multer (they are available as arrays under req.files)
    const posterFile =
      req.files && req.files.posterImage ? req.files.posterImage[0] : null;
    const bannerFile =
      req.files && req.files.bannerImage ? req.files.bannerImage[0] : null;

    let posterImageUrl = null;
    let bannerImageUrl = null;

    // Upload poster image to Cloudinary if available
    if (posterFile) {
      const uploadResponse = await uploadOnCloudinary(posterFile.path);
      if (!uploadResponse) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload poster image" });
      }
      posterImageUrl = uploadResponse.secure_url;
    }

    // Upload banner image to Cloudinary if available
    if (bannerFile) {
      const uploadResponse = await uploadOnCloudinary(bannerFile.path);
      if (!uploadResponse) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to upload banner image" });
      }
      bannerImageUrl = uploadResponse.secure_url;
    }

    // Correct date and time parsing
    // Using the date string from the form directly will create a local time Date object.
    const eventDate = new Date(date);
    const eventStartTime = new Date(`${date}T${startTime}:00`);
    const eventEndTime = endTime ? new Date(`${date}T${endTime}:00`) : null;

    // Validate parsed dates
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

    // Check if an event at the same date/time and venue already exists
    const existingEvent = await prisma.event.findFirst({
      where: {
        date: eventDate,
        startTime: eventStartTime,
        venueId: chosenVenue.id,
      },
    });
    if (existingEvent) {
      return res.status(409).json({
        success: false,
        message:
          "Event already exists at the same venue at the same date and time",
      });
    }

    // Convert totalTickets into an array of seat numbers
    const convertTicketToSeat = async (totalTickets) => {
      const seatsAvailable = [];
      for (let i = 1; i <= totalTickets; i++) {
        seatsAvailable.push(i.toString());
      }
      return seatsAvailable;
    };
    const seatsAvailable = await convertTicketToSeat(totalTickets);

    // Ensure userEkycRequired is boolean
    const userEkycRequiredBool =
      typeof userEkycRequired === "undefined"
        ? false
        : userEkycRequired === "true" || userEkycRequired === true;

    // Create a new event including the image URLs
    const createNewEvent = await prisma.event.create({
      data: {
        title,
        description,
        artist,
        date: eventDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        ticketsAvailable: parseInt(totalTickets, 10),
        price: parseFloat(price),
        seatsAvailable,
        userEkycRequired: userEkycRequiredBool,
        posterImage: posterImageUrl,
        bannerImage: bannerImageUrl,
        host: {
          connect: { id: host.id },
        },
        venueInformation: {
          connect: { id: chosenVenue.id },
        },
      },
    });

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
