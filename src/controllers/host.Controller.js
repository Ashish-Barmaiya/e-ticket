import env from "dotenv"
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

env.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const prisma = new PrismaClient();

const registerHost = async (req, res) => {
    // Validating the request using express-validator
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }
    // Accessing validated data
    const { name, email, phoneNumber, password } = req.body;
    
    try {
        // Checking for existing host with the same email
        const existingHost = await prisma.hosts.findUnique({
            where: { 
                email: email
            } 
        });
        // If host already exists, sending error
        if (existingHost) {    
            return res.status(400).json({ message: "Host already exists with this email" });
        } 
        // If the host does not exist, inserting a new host record
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newHost = await prisma.hosts.create({
            data: {
                name: name,
                email: email,
                phone: phoneNumber,
                password: hashedPassword
            }
        });

        console.log("Successfully registerd host", newHost);
        res.redirect("/host");

    } 
    catch (error) {
        console.error("Error during host registration", error);
        res.status(500).send("Internal Server Error");
    } 
    finally {
        // Disconnecting Prisma Client after the request is handled
        await prisma.$disconnect();
    }
    
};

// PASSPORT LOCAL STRATEGY //
passport.use(
  "local-host",
  new LocalStrategy({ usernameField: "email" }, async function verify (email, password, done) {
    try {
        // Finding the host by email in the database
        const host = await prisma.hosts.findUnique({
          where: { email },
        });
        // If the host is not found, returning an error
        if (!host) {
          return done(null, false, { message: "Host not found" });
        }
        // Validating the password
        const isPasswordValid = await bcrypt.compare(password, host.password);
  
        if (!isPasswordValid) {
          return done(null, false, { message: "Incorrect Password" });
        }
        // Authentication successful, returning the host object
        return done(null, host);
  
    } catch (error) {
        console.error("Error during host authentication:", error);
        return done(error);
    }
  })
);
  
// PASSPORT SERIALIZEUSER //
passport.serializeUser((user, done) => {
  done(null, user.id);
});
  
// PASSPORT DESERIALIZEUSER //
passport.deserializeUser(async (id, done) => {
  try {
      // For Host table
      const host = await prisma.hosts.findUnique({ where: { id } });
      if (host) {
        return done(null, host);
      }
      // For User table
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) {
        return done(null, user);
      }
      // If no match is found in either tables
      return done(null, false);
  
  } catch (error) {
      return done(error, false);
  }
});
  
// LOGIN FUNCTION INVOKING THE LOCAL STRATEGY //
const loginHost = (req, res, next) => {
  // Validating the request using express-validator
  const validationErrors = validationResult(req);
  
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }
  // Using Passport authenticate method with the local strategy
  passport.authenticate("local-host", async (err, user, info) => {
    console.log("Inside passport.authenticate callback");
  
    if (err) return next(err);   
    if (!user) return res.redirect("/host/hostlogin?error=" + info.message);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    //Store refreshToken in database
    await prisma.hosts.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    // Send token in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
     });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });

    // Redirect to host-dashboard page
    res.redirect("/host/dashboard");
  })(req, res, next);
}

// NEW REFRESH TOKEN//
const newRefreshToken = async (req, res) => {
  const refreshToken = req.cookie.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

  try {
    // Find host with refresh token
    const host = await prisma.hosts.findFirst({
      where: { refreshToken: refreshToken}
    });

    if (!host) return res.status(401).json({ message: "Invalid refresh token" });

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Update tokens
    const updateAccessToken = generateAccessToken(user);
    const updateRefreshToken = generateRefreshToken(user);

    // Update refresh token in database
    await prisma.hosts.update({
      where: { id: host.id },
      data: { refreshToken: refreshToken }
    });

    // Set new cookies
    res.cookie("accessToken", updateAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });

    res.cookie("refreshToken", updateRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
    });

    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (error) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}

// ADD VENUE //
const addVenue = async(req, res) => {

  const { name, address, seatingCapacity, seatingCategories, seatingLayout, venueType } = req.body;
  const hostId = req.user.id;
  console.log("Data Fetched:", { name, address, seatingCapacity, seatingCategories, seatingLayout, venueType } );
  
  try {
    const existingVenue = await prisma.venueInformation.findFirst({
    where: { name, address }
    });

    if (existingVenue) {
    return res.status(400).json({ message: "Venue already added" });
    }

    const newVenue = await prisma.venueInformation.create({
      data: {
        name,
        address,
        seatingCapacity: parseInt(seatingCapacity, 10),
        seatingCategories,
        seatingLayout,
        venueType,
        host: {
          connect: { id: hostId } // Connect the event to the host
      }
      }
    });

    console.log("Venue Created Successfully: ", newVenue);
    return res.status(200).json({ message: "Venue Create Successfully", venue: newVenue });
    
  } catch (error) {
    console.error("Error during venue creation: ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}
  
export {
  registerHost,
  loginHost,
  addVenue,
  newRefreshToken
};