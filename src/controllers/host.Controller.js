import env from "dotenv"
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

env.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const prisma = new PrismaClient();

// HOST REGISTER //
const registerHost = async (req, res) => {
    // Accessing data
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
  
// LOGIN FUNCTION INVOKING THE LOCAL STRATEGY //
const loginHost = (req, res, next) => {
  // Using Passport authenticate method with the local strategy
  passport.authenticate("local-host", async (err, user, info) => {
  
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

// ADD VENUE //
const addVenue = async(req, res) => {
  // Get Data from request
  const { name, address, seatingCapacity, seatingCategories, seatingLayout, venueType } = req.body;
  console.log("Data Fetched:", { name, address, seatingCapacity, seatingCategories, seatingLayout, venueType });
  
  // Getting host using refresh token
  const host = await prisma.hosts.findFirst({
    where: { refreshToken: req.cookies.refreshToken }
  });

  try {
    // Check for existing venue with same name and address
    const existingVenue = await prisma.venueInformation.findFirst({
    where: { 
      name,
      address
    }
    });

    if (existingVenue) return res.status(400).json({ message: "Venue already added" });

    // Create new venue in database
    const newVenue = await prisma.venueInformation.create({
      data: {
        name,
        address,
        seatingCapacity: parseInt(seatingCapacity, 10),
        seatingCategories,
        seatingLayout,
        venueType,
        host: {
          connect: { id: host.id } // Connect the event to the host
          }
      }
    });

    // Return success
    console.log("Venue Created Successfully: ", newVenue);
    return res.status(200).json({ message: "Venue Create Successfully", venue: newVenue });
    
  } catch (error) {
    console.error("Error during venue creation: ", error);
    res.status(500).json({ message: "Internal Server error" });
  }
}

// HOST CHANGE PASSWORD //
const hostChangePassword = async (req, res) => {
  // Get data from request
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    prisma.$transaction( async (prisma) => {
      // Get host using refresh token from cookies
      const host = await prisma.hosts.findFirst({
        where: { refreshToken: req.cookies.refreshToken }
      });

      if (!host) return res.status(404).json({ message: "Host does not exist or Invalid refresh token." });

      // Compare email
      const checkEmail = await prisma.hosts.findUnique({
        where: { email }
      });

      if (!checkEmail) return res.status(400).json({ message: "Email does not exist." });

      // Compare Old Password using bcrypt
      const compareOldPassword = await bcrypt.compare(oldPassword, host.password);

      if (!compareOldPassword) return res.status(400).json({ message: "Incorrect password" });

      // Match New Password and Confirm Password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New Password does not match with confirm password" });
      }

      // Hash New Password
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

      // Update hosts table with new password
      const changedPassword = await prisma.hosts.update({
        where: { id: host.id },
        data: { password: hashedPassword }
      });
      
      // Return success
      console.log("Host Password changed successfully. ", changedPassword);
      return res.status(200).json({ message: "Password changed successfully" });

    })
  } catch (error) {
    console.error("Error changing host password: ", error);
    return res.status(500).json({ message: "Internal error while changing password" });    
  }
}

export {
  registerHost,
  loginHost,
  addVenue,
  hostChangePassword
}