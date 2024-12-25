import env from "dotenv";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

env.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const prisma = new PrismaClient();

/// USER SIGN UP ///
const registerUser = async (req, res) => {
  // Accessing data
  const { name, email, phoneNumber, password } = req.body;

  try {
    // Checking for existing user with the same email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    // If user exists with the same email, sending an error
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }
    // If the user does not exist, inserting a new user record
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        fullName: name,
        email: email,
        phone: phoneNumber,
        password: hashedPassword,
      },
    });

    console.log("Succesfully created new user ", newUser);
    res.redirect("/user");
  } catch (error) {
    console.error("Error during user sign up: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/// USER SIGN IN ///
//PASSPORT LOCAL STRATEGY //
passport.use(
  "local-user",
  new LocalStrategy({ usernameField: "email" }, async function verify(
    email,
    password,
    done,
  ) {
    try {
      // Finding the user by email in the database
      const user = await prisma.user.findUnique({
        where: { email },
      });
      // If the user is not found, returning an error
      if (!user) {
        return done(null, false, { message: "User does not exist" });
      }
      // Validating the password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect Password" });
      }
      // Authentication successful, returning the user object
      return done(null, user);
    } catch (error) {
      console.error("Error during user authentication: ", error);
      return done(error);
    }
  }),
);

// LOGIN FUNCTION INVOKING THE LOCAL STRATEGY //
const loginUser = asyncHandler(async (req, res, next) => {
  // Using Passport authenticate method with the local strategy
  passport.authenticate("local-user", async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in database
    await prisma.user
      .update({
        where: { id: user.id },
        data: { refreshToken },
      })
      .catch((error) => {
        throw new ApiError(500, "Error updating refresh token", error);
      });

    // Send token in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Redirect to profile page
    res.redirect("/user/profile");
  })(req, res, next);
});

// UPDATE USER INFO //
const updateUserInfo = async (req, res) => {
  try {
    // Get data from request
    const {
      fullName,
      dateOfBirth,
      gender,
      areaPincode,
      addressLine1,
      addressLine2,
      landmark,
      state,
      country,
    } = req.body;

    // Getting user through refreshToken
    const user = await prisma.user.findFirst({
      where: { refreshToken: req.cookies.refreshToken },
    });

    // Helper to filter out undefined or empty fields
    const buildUpdateData = (fields) => {
      return Object.fromEntries(
        Object.entries(fields).filter(
          ([value]) => value !== undefined && value !== "",
        ),
      );
    };

    // Construct data for user and address updates only with non-empty values
    const userUpdateData = buildUpdateData({ fullName, dateOfBirth, gender });
    const addressUpdateData = buildUpdateData({
      areaPincode: areaPincode ? parseInt(areaPincode) : undefined,
      addressLine1,
      addressLine2,
      landmark,
      state,
      country,
    });

    // Update user basic details if any provided
    let updateUser;
    if (Object.keys(userUpdateData).length) {
      updateUser = await prisma.user.update({
        where: { id: user.id },
        data: userUpdateData,
      });
    }

    // Check if user address exists, then update or create as necessary
    const existingAddress = await prisma.userAddress.findFirst({
      where: { userId: user.id },
    });

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
        data: { userId: user.id, ...addressUpdateData },
      });
      console.log("Created new user address");
    }

    console.log("User details updated successfully:", updateUser);
    return res
      .status(200)
      .json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user info:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating user info." });
  }
};

// USER MY-TICKETS //
const myTickets = async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });

  try {
    // Get all tickets booked by user
    const allTickets = await prisma.ticket.findMany({
      where: {
        AND: [{ userId: user.id }, { status: "Active" }],
      },
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
                address: true,
              },
            },
          },
        },
      },
    });

    if (!allTickets)
      return res.status(404).json({ message: "No ticket found" });

    return res.render("userPages/userTickets", {
      allTickets: allTickets,
    });
  } catch (error) {
    console.error("Error fetching user tickets: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// USER CHANGE PASSWORD //
const userChangePassword = async (req, res) => {
  const { email, oldPassword, newPassword, confirmPassword } = req.body;

  try {
    // Validations
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Get user using refreshToken from cookies and verify email
    const user = await prisma.user.findFirst({
      where: {
        refreshToken: req.cookies.refreshToken,
        email: email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid refresh token or email" });
    }

    // Compare old hashed password
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New Password does not match with confirm password" });
    }

    // Hash newPassword
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error while changing password" });
  }
};

export {
  registerUser,
  loginUser,
  updateUserInfo,
  myTickets,
  userChangePassword,
};
