import env from "dotenv";
import bcrypt from "bcrypt";
import fs from "fs/promises";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseXmlFile } from "../utils/parseXmlFile.js";
import { PrismaClient } from "@prisma/client";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { generateHash } from "../utils/generateHash.js";
import { redisClient } from "../../app.js";
import { sendOtpViaPhoneNumber, sendOtpViaEmail } from "../utils/otp.js";
import { decryptData, encryptData } from "../utils/encrypt.js";

env.config();
const saltRounds = parseInt(process.env.SALT_ROUNDS);
const prisma = new PrismaClient();

/// INITIALIZE USER SIGN UP AND SEND EMAIL-OTP ///
const initializeUserRegistrationAndSendEmailOtp = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  // Store user data in session
  req.session.userData = { name, email, phoneNumber, password };

  try {
    // Checking for existing user with the same email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser && existingUser.emailVerification === true) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Encrypt phone number & check if phone number has already been taken
    const encryptedPhoneNumber = encryptData(phoneNumber);

    if (!encryptedPhoneNumber) {
      console.log("Error encrypting phone number");
      return res
        .status(500)
        .json({ success: false, message: "Error encrypting phone number" });
    }

    const isPhoneNumberAlreadyused = await prisma.user.findFirst({
      where: { phone: encryptedPhoneNumber },
    });

    if (isPhoneNumberAlreadyused) {
      console.log("Phone number has already been used");
      return res.status(400).json({
        success: false,
        message: "Phone number has already been used",
      });
    }

    // Generate otp
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const otp = generateOtp();

    // Send otp via email
    const sendOtp = await sendOtpViaEmail(email, otp);

    if (!sendOtp) {
      console.log("Error sending otp via email");
      return res
        .status(500)
        .json({ success: false, message: "Error sending email" });
    }

    // Store otpData in session for verification later
    req.session.otpData = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    console.log("OTP sent successfully via Email");

    return res.status(200).json({
      success: true,
      email,
    });
  } catch (error) {
    console.error("Error initializing user registration: ", error);
    res.status(500).json({
      success: false,
      message: "Error initializing user registration",
      error,
    });
  }
};

// USER VERIFY EMAIL AND COMPLETE REGISTRATION //
const verifyUserEmailAndCompleteRegistration = async (req, res) => {
  const { otp } = req.body;
  const otpData = req.session.otpData;
  const userData = req.session.userData;

  try {
    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      console.log("OTP has expired");
      return res
        .status(400)
        .json({ success: false, message: "OTP has expired" });
    }

    // Verify OTP
    if (Number(otp) !== otpData.otp) {
      console.log("Invalid OTP");
      return res.status(401).json({ success: false, message: "Inavalid OTP" });
    }

    // Encrypt phone number
    const encryptedPhoneNumber = encryptData(userData.phoneNumber);

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        fullName: userData.name,
        email: userData.email,
        phone: encryptedPhoneNumber,
        password: hashedPassword,
        emailVerification: true,
      },
    });

    if (!newUser) {
      console.log("Error creating new user: ", error);
    }
    console.log("Succesfully created new user ", newUser);
    return res.status(200).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error during user sign up: ", error);
    res
      .status(500)
      .json({ success: false, message: "Error during user sign up", error });
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

    // Decypt user Phone Number
    const decryptedPhoneNumber = decryptData(user.phone);

    // Send user data with sucess status
    res.status(200).json({
      success: true,
      message: "Login Successful",
      user,
      decryptedPhoneNumber,
    });
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
        user: {
          select: {
            fullName: true,
            uniqueUserIdentity: true,
          },
        },
      },
    });

    if (!allTickets) {
      return res.status(404).json({ message: "No ticket found" });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully fetched user my-tickets",
      tickets: allTickets,
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

// USER EXTRACT XML DATA FOR E-KYC //
const extractAadhaarXml = async (req, res) => {
  try {
    // Identify the user
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      await fs.unlink(filePath);
      return res
        .status(401)
        .json({ message: "Unauthorized: No refresh token" });
    }

    const user = await prisma.user.findFirst({ where: { refreshToken } });
    if (!user) {
      console.log("USer not found during e-kyc");
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user eKyc is already been done
    if (user.eKyc === true) {
      return res
        .status(400)
        .json({ message: "Your e-Kyc has already been done." });
    }

    // Ensure file exits
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const filePath = req.file.path;

    // Parse the XML file
    let xmlData;
    try {
      xmlData = await parseXmlFile(filePath);
    } catch (error) {
      await fs.unlink(filePath); // Clean up the uploaded file
      return res.status(400).json({ message: "Invalid XML file format" });
    }

    // Process the extracted data
    const extractedDataFromXmlFile = {
      referenceId: xmlData?.OfflinePaperlessKyc?.$?.referenceId,
      fullName: xmlData?.OfflinePaperlessKyc?.UidData?.Poi?.$?.name,
      mobileHash: xmlData?.OfflinePaperlessKyc?.UidData?.Poi?.$?.m,
      dateOfBirth: xmlData?.OfflinePaperlessKyc?.UidData?.Poi?.$?.dob,
      gender: xmlData?.OfflinePaperlessKyc?.UidData?.Poi?.$?.gender,
      aadhaarXmlFilePassword: req.body.aadhaarXmlFilePassword, // shareable password from body
    };

    console.log("Extracted Data from Xml File: ", extractedDataFromXmlFile);

    // Creating key from userId for redis storage
    const key = `xml:${user.id}`;

    try {
      //Storing xml data and password in redis
      await redisClient.set(key, JSON.stringify(extractedDataFromXmlFile), {
        EX: 3600,
      });
    } catch (error) {
      console.error("Error storing data in redis: ", error);
      res.status(500).send("Failed to store data in redis");
    }

    // Success Response
    res.redirect("/user/profile/user-ekyc/verify-phone-number");

    // Delete the file after processing
    await fs.unlink(filePath);
  } catch (error) {
    console.error("Error parsing XML File", error);
    res.status(500).json({ message: error.message });
  }
};

// USER VERIFY-PHONE-NUMBER FROM AADHAAR //
const verifyUserMobileAndSendOtp = async (req, res) => {
  try {
    // Get phoneNumber from body
    const { aadhaarPhoneNumber } = req.body;

    // Encrypt phoneNumber
    const encryptedUserEnteredPhoneNumber = encryptData(aadhaarPhoneNumber);

    // Check if the phone number has already been used  e-kyc
    const existingEkycWithPhoneNumber = await prisma.user.findFirst({
      where: { aadhaarPhoneNumber: encryptedUserEnteredPhoneNumber },
    });

    if (
      existingEkycWithPhoneNumber &&
      existingEkycWithPhoneNumber.eKyc === true
    ) {
      return res.status(400).json({
        message: "This mobile number has already been used for e-kyc purpose",
      });
    }

    // Get Key to retrieve redis data
    const user = await prisma.user.findFirst({
      where: { refreshToken: req.cookies.refreshToken },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const key = `xml:${user.id}`;

    // Get data from redis
    const jsonDataString = await redisClient.get(key);

    if (!jsonDataString) {
      return res.status(404).send("No data found for the given userId");
    }

    const jsonData = JSON.parse(jsonDataString);

    console.log(jsonData);

    // Get last 4 digits of aadhaar number from refernce id
    const referenceId = jsonData.referenceId;
    const lastFourDigitsOfAadhaarNumber = referenceId.substr(0, 4);

    // Get last digit of aadhaar number
    const lastDigitOfAadhaarNumber = lastFourDigitsOfAadhaarNumber.slice(-1);

    // Get shareable passcode
    const aadhaarXmlFilePassword = jsonData.aadhaarXmlFilePassword;

    // Remove country code from user-input aadhaar number
    const filteredAadhaarPhoneNumber = aadhaarPhoneNumber.slice(-10);

    // Generate hash of mobile number
    const newMobileHash = generateHash(
      filteredAadhaarPhoneNumber,
      aadhaarXmlFilePassword,
      lastDigitOfAadhaarNumber,
    );

    console.log("New Mobile Hash: ", newMobileHash);

    // Get original hash of mobile number
    const originalMobileHash = jsonData.mobileHash;

    // Compare hashes
    if (originalMobileHash !== newMobileHash) {
      return res
        .status(500)
        .json({ message: "This mobile number is not linked to any aadhaar" });
    }

    const phoneNumber = filteredAadhaarPhoneNumber;

    // Store phoneNumber in session temporarily for later use
    req.session.phoneNumber = phoneNumber;

    // Generate otp
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const otp = generateOtp();

    // CallsendOtp function
    const sentOtp = await sendOtpViaPhoneNumber(phoneNumber, otp);

    if (!sentOtp) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({ message: "Error sending OTP" });
    }

    // Store otpData in session for verification later
    req.session.otpData = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    console.log("OTP SENT SUCCESSFULLY");

    return res.redirect("/user/profile/user-ekyc/verify-otp");
  } catch (error) {
    console.error("Error in verifyUserMobile:", error); // Log the error for debugging
    res.status(500).json({ message: error.message });
  }
};

// VERIFY OTP //
const userVerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const storedOtpData = req.session.otpData;

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found in session" });
    }

    // Check if OTP has expired
    if (Date.now() > storedOtpData.expiresAt) {
      console.log("OTP has expired");
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    if (Number(otp) !== storedOtpData.otp) {
      console.log("Invalid OTP");
      return res.status(401).json({ message: "Inavalid OTP" });
    }

    // Get Key to retrieve redis data
    const user = await prisma.user.findFirst({
      where: { refreshToken: req.cookies.refreshToken },
      select: {
        id: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const key = `xml:${user.id}`;

    // Get aadhaarXmlFileData from redis
    const redisData = JSON.parse(await redisClient.get(key));

    if (!redisData) {
      return res
        .status(500)
        .json({ message: "Error getting redis data for the user" });
    }

    const userDataFromRedis = {
      lastFourDigitsOfUserAadhaarNumber: redisData.referenceId.substr(0, 4),
      userAadhaarFullname: redisData.fullName,
      userAadhaarDateOfBirth: redisData.dateOfBirth,
      userAadhaarGender: redisData.gender,
    };

    // Get aadhaarPhoneNumber from session
    const userAadhaarPhoneNumber = req.session.phoneNumber;

    // Concatenate name, mobile number and lastFourDigits of aadhaar and hash it
    let inputToCreateUuiHash =
      userDataFromRedis.userAadhaarFullname +
      userAadhaarPhoneNumber +
      userDataFromRedis.lastFourDigitsOfUserAadhaarNumber;

    inputToCreateUuiHash = inputToCreateUuiHash.trim().toLowerCase();

    // Create User Unique Identity
    const uniqueUserIdentity = await bcrypt.hash(
      inputToCreateUuiHash,
      saltRounds,
    );
    console.log("User Unique Identity: ", uniqueUserIdentity);

    // Encrypt last four digits of aadhaar
    const encryptedAadhaarNumber = await encryptData(
      userDataFromRedis.lastFourDigitsOfUserAadhaarNumber,
    );

    if (!encryptedAadhaarNumber) {
      console.log("Error encrypting Aadhaar Number");
      return res
        .status(500)
        .josn({ message: "Error encryptin Aadhaar Number" });
    }

    // Encrypt aadhaar phone number
    const encryptedAadhaarPhoneNumber = encryptData(userAadhaarPhoneNumber);

    if (!encryptedAadhaarPhoneNumber) {
      console.log("Error encrypting Aadhaar Phone Number");
      return res
        .status(500)
        .josn({ message: "Error encrypting Aadhaar Phone Number" });
    }

    // If user aadhaarPhoneNumber and phoneNumber used for sign-up are same, update user.phoneVerification
    const phoneVerificationStatus =
      userAadhaarPhoneNumber === user.phone ? true : false;

    await prisma.$transaction(async (prisma) => {
      // update name, mobile number, dob, gender, UUI and eKyc status in user model
      await prisma.user.update({
        where: { id: user.id },
        data: {
          uniqueUserIdentity,
          aadhaarNumber: encryptedAadhaarNumber,
          aadhaarPhoneNumber: encryptedAadhaarPhoneNumber,
          fullName: userDataFromRedis.userAadhaarFullname,
          gender: userDataFromRedis.userAadhaarGender,
          eKyc: true,
          phoneVerification: phoneVerificationStatus,
        },
      });

      console.log("User eKyc successful");

      return res.render("userPages/userEkycSuccess");
    });
  } catch (error) {
    console.error("Internal server error while verifying otp: ", error);
    return res
      .status(500)
      .json({ message: "Internal server error while verifying otp: " });
  }
};

//USER PHONE NUMBER (non-aadhaar) SEND OTP //
const sendOtpToUserPhoneNumber = async (req, res) => {
  try {
    // Get user
    const user = await prisma.user.findFirst({
      where: { refreshToken: req.cookies.refreshToken },
    });

    if (!user) {
      console.log("User not found while verifying user phone number");
      return res.status(404).json({ message: "User not found" });
    }

    // Decrypt user phone number
    const decryptedPhoneNumber = decryptData(user.phone);

    // Generate OTP
    const generateOtp = () => {
      return Math.floor(100000 + Math.random() * 900000);
    };

    const otp = generateOtp();

    // Send OTP to phone number
    const sendOtp = await sendOtpViaPhoneNumber(decryptedPhoneNumber, otp);

    if (!sendOtp) {
      console.log("Error sending OTP while verifying user phone number");
      return res.status(500).json({
        message: "Error sending OTP while verifying user phone number",
      });
    }

    // Store OTP data in session
    req.session.otpDataForPhoneVerification = {
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    console.log("OTP Data: ", req.session.otpDataForPhoneVerification);

    console.log("OTP sent successfully");

    return res.redirect(
      "/user/profile/edit-profile/enter-otp-to-verify-phone-number",
    );
  } catch (error) {
    console.error("Error sending OTP while verifying user phone number", error);
    return res.status(500).json({
      message: "Error sending OTP while verifying user phone number",
    });
  }
};

// USER PHONE NUMBER (non-aadhaar) VERIFY OTP //
const verifyUserPhoneNumberOtp = async (req, res) => {
  const { otp } = req.body;
  const otpDataForPhoneVerification = req.session.otpDataForPhoneVerification;
  console.log("OTP DATA RETRIEVED", otpDataForPhoneVerification);

  if (!otpDataForPhoneVerification) {
    return res.status(400).json({ message: "OTP not available in session" });
  }

  const user = await prisma.user.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });

  try {
    // Check if OTP is expired
    if (Date.now() > otpDataForPhoneVerification.expiresAt) {
      console.log("OTP has expired");
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Verify OTP
    if (Number(otp) !== otpDataForPhoneVerification.otp) {
      console.log("Invalid OTP");
      return res.status(401).json({ message: "Inavalid OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { phoneVerification: true },
    });

    console.log("User Phone Number Verified Successfully");
    return res.redirect("/user/profile/edit-profile");
  } catch (error) {
    console.error(
      "Error verifying OTP for user's phone number verification",
      error,
    );
    return res.status(500).json({
      message: "Error verifying OTP for user's phone number verification",
    });
  }
};

export {
  initializeUserRegistrationAndSendEmailOtp,
  verifyUserEmailAndCompleteRegistration,
  loginUser,
  updateUserInfo,
  myTickets,
  userChangePassword,
  extractAadhaarXml,
  verifyUserMobileAndSendOtp,
  userVerifyOtp,
  sendOtpToUserPhoneNumber,
  verifyUserPhoneNumberOtp,
};
