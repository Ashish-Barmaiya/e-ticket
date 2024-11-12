import env from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";

env.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const prisma = new PrismaClient();

/// USER SIGN UP ///
const registerUser = async(req, res) => {

    // Validating the request using express-validator
    const validationErrors = validationResult(req);
    
    if (!validationErrors.isEmpty()) {
        console.log("Error validating data:");
        return res.status(400).json({ errors: validationErrors.array()} );
    }

    const { name, email, phoneNumber, password } = req.body;

    try {
        // Checking for existing user with the same email
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        // If user exists with the same email, sending an error
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email"} );
        }
        // If the user does not exist, inserting a new user record
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                fullName: name,
                email: email,
                phone: phoneNumber,
                password: hashedPassword
            }
        });
        
        console.log("Succesfully created new user ", newUser);
        res.redirect("/user")

    } catch (error) {
        console.error("Error during user sign up: ", error);
        res.status(500).json({ message: "Internal Server Error"} );
        
    }
}

/// USER SIGN IN ///
//PASSPORT LOCAL STRATEGY //
passport.use(
    "local-user",
    new LocalStrategy ({ usernameField : "email"}, async function verify(email, password, done) {
        try {
            // Finding the user by email in the database
            const user = await prisma.user.findUnique({
                where: {
                    email: email
                }
            })
            // If the host is not found, returning an error
            if (!user) {
                return done(null, false, { message: "User does not exist" });
            }
            // Validating the password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return done(null, false, { message: "Incorrect Password" });
            }
            // Authentication successful, returning the host object
            return done(null, user)

        } catch (error) {
            console.error("Error during user authentication: ", error);
            return done (error)
        }
    })
)

// PASSPORT SERIALIZE USER //
passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize only the user ID
});

// PASSPORT DESERIALIZE USER //
passport.deserializeUser(async (id, done) => {
    try {
        // For Host table
        const host = await prisma.hosts.findUnique({ where: { id: id } });
        if (host) {
            return done(null, host);
        }
        // For User table
        const user = await prisma.user.findUnique({ where: { id: id } });
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
const loginUser = (req, res, next) => {
    
    // Validating the request using express-validator
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        return res.status(400).json({ errors: validationErrors.array() });
    }
    // Using Passport authenticate method with the local strategy
    passport.authenticate("local-user", async (err, user, info) => {

        if (err) return next(err);
        if(!user) return res.redirect("/user/user-sign-in?error=" + info.message);

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store refresh token in database
        await prisma.user.update({
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

        // Redirect to profile page
        res.redirect("/user/profile");
    })(req, res, next);
}

// NEW REFRESH TOKEN //
const newRefreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(401).json({ message: "Refresh token missing" });

    try {
        // Find user with refresh token
        const user = await prisma.user.findFirst({
            where: { refreshToken: refreshToken}
        });

        if (!user) return res.status(401).json({ message: "Invalid refresh token" });

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        
        // Update tokens
        const updateAccessToken = generateAccessToken(user);
        const updateRefreshToken = generateRefreshToken(user);

        // Update refresh token in database
        await prisma.user.update({
            where: { id: user.id},
            data: { refreshToken: updateRefreshToken }
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

        res.status(200).json({ message: "Tokens refreshed successfully"});
    } catch (error) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).json({ message: "Invalid refresh token" });
    }
}

// UPDATE USER INFO //
const updateUserInfo = async (req, res) => {
    try {
        // Validate and sanitize incoming data
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            console.log("Error validating data:");
            return res.status(400).json({ errors: validationErrors.array() });
        }

        const { fullName, dateOfBirth, gender, areaPincode, addressLine1, addressLine2, landmark, state, country } = req.body;
        const userId = req.user.id;

        // Helper to filter out undefined or empty fields
        const buildUpdateData = (fields) => {
            return Object.fromEntries(
                Object.entries(fields).filter(([_, value]) => value !== undefined && value !== "")
            );
        };

        // Construct data for user and address updates only with non-empty values
        const userUpdateData = buildUpdateData({ fullName, dateOfBirth, gender });
        const addressUpdateData = buildUpdateData({ 
            areaPincode: areaPincode? parseInt(areaPincode) : undefined,
            addressLine1, 
            addressLine2,
            landmark,
            state,
            country });

        // Update user basic details if any provided
        let updateUser;
        if (Object.keys(userUpdateData).length) {
            updateUser = await prisma.user.update({
                where: { id: userId },
                data: userUpdateData,
            });
        }

        // Check if user address exists, then update or create as necessary
        const existingAddress = await prisma.userAddress.findFirst({ where: { userId: userId } });

        if (existingAddress) {
            // Update address if there are fields to update
            if (Object.keys(addressUpdateData).length) {
                await prisma.userAddress.update({
                    where: { id: existingAddress.id },
                    data: addressUpdateData,
                });
                console.log("Updated user address");
            }
        } else if (Object.keys(addressUpdateData).length) {
            // Create new address if none exists and there is data to insert
            await prisma.userAddress.create({
                data: { userId: userId, ...addressUpdateData },
            });
            console.log("Created new user address");
        }

        console.log("User details updated successfully:", updateUser);
        return res.status(200).json({ message: "User profile updated successfully" });

    } catch (error) {
        console.error("Error updating user info:", error);
        return res.status(500).json({ error: "An error occurred while updating user info." });
    }
};

// USER'S TICKETS //
const myTickets = async(req, res) => {

    try {
        // Get all tickets booked by user
        const allTickets = await prisma.ticket.findMany({
            where: { userId : req.user.id},
            include: { 
                event: {
                    select: {
                        title: true,
                        date: true,
                        startTime: true,
                        artist: true,
                        venueInformation: {
                            select: {
                                name: true,
                                address: true
                            },
                        },
                    },
                },
            },
        });

        if (!allTickets) {
            return res.status(404).json({ message: "No ticket found"});
        }

        return res.render("userPages/userTickets", {
            allTickets : allTickets,
        })

    } catch (error) {
        console.error("Error fetching user tickets: ", error);
        return res.status(500).json({ message: "Internal server error"});
    }
}

export {
    registerUser,
    loginUser,
    updateUserInfo,
    myTickets,
    newRefreshToken
}