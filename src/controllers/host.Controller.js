import env from "dotenv"
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

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
  passport.authenticate("local-host", (err, user, info) => {
    console.log("Inside passport.authenticate callback");
  
    if (err) {
      console.error("Error in passport authentication:", err);
      return next(err);
    }
      
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.redirect("/host/hostlogin?error=" + info.message);
    }
  
    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Error in req.login:", loginErr);
        return next(loginErr);
      }
  
      console.log("Successfully logged in host:", user.email);
      res.redirect(`/host/${user.id}/dashboard`);
    });
  })(req, res, next);
}

/// ADD VENUE ///
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
  addVenue
};