import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.Middleware.js";
import {
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
} from "../controllers/user.Controllers.js";
import {
  validate,
  userRegisterValidator,
  userLoginValidator,
  userUpdateValidator,
  userChangePasswordValidator,
} from "../utils/validators.js";
import TicketController from "../controllers/tickets.Controller.js";
import { PrismaClient } from "@prisma/client";
import { decryptData } from "../utils/encrypt.js";

const router = express.Router();
const prisma = new PrismaClient();

// USER PAGE GET ROUTE //
router.get("/", (req, res) => {
  if (req.cookies.accessToken) {
    res.redirect("/user/profile");
  } else {
    res.render("userPages/userPage");
  }
});

// USER SIGN UP PAGE GET ROUTE //
router.get("/user-sign-up", (req, res) => {
  res.render("userPages/userSignUp");
});

// USER SIGN UP PAGE POST ROUTE //
router
  .route("/user-sign-up")
  .post(
    validate(userRegisterValidator),
    initializeUserRegistrationAndSendEmailOtp,
  );

// USER VERIFY EMAIL GET ROUTE //
router.get("/verify-email", (req, res) => {
  res.render("userPages/userVerifyEmail");
});

// USER VERIFY EMAIL POST ROUTE //
router.post("/verify-email", verifyUserEmailAndCompleteRegistration);

// USER SIGN IN PAGE GET ROUTE //
router.get("/user-sign-in", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });
  res.render("userPages/userSignIn", {
    user,
  });
});

// USER SIGN IN PAGE POST ROUTE //
router.route("/user-sign-in").post(validate(userLoginValidator), loginUser);

// USER PROFILE PAGE GET ROUTE //
router.get("/profile", userLoginAuth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });
  res.render("userPages/userProfile", {
    user,
  });
});

// USER EDIT PROFILE GET ROUTE //
router.get("/profile/edit-profile", userLoginAuth, async (req, res) => {
  // Get user
  const user = await prisma.user.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
    include: { addresses: true },
  });

  // Decrypt and Mask userPhonNumber
  const userPhoneNumber = decryptData(user.phone);
  const maskedUserPhoneNumber =
    userPhoneNumber.substr(0, 2) + "******" + userPhoneNumber.slice(-2);

  res.render("userPages/userEditProfile", {
    user,
    maskedUserPhoneNumber,
  });
});

// USER EDIT PROFILE POST ROUTE //
router.post(
  "/profile/edit-profile",
  userLoginAuth,
  validate(userUpdateValidator),
  updateUserInfo,
);

// USER MY-TICKETS GET ROUTE //
router.get("/profile/my-tickets", userLoginAuth, myTickets);

// USER VIEW TICKET GET ROUTE //
router.get("/profile/my-tickets/view-ticket/:ticketId", userLoginAuth);

// USER CANCEL TICKET GET ROUTE //
router.get(
  "/profile/my-tickets/cancel-ticket/:ticketId",
  userLoginAuth,
  async (req, res) => {
    const ticket = await prisma.ticket.findUnique({
      where: { id: req.params.ticketId },
    });
    res.render("userPages/userCancelTicket", {
      ticket,
    });
  },
);

// USER CANCEL TICKET POST ROUTE //
router.post(
  "/profile/my-tickets/cancel-ticket/:ticketId",
  userLoginAuth,
  TicketController.cancelTicket,
);

// USER CHANGE PASSWORD GET ROUTE //
router.get("/profile/user-change-password", userLoginAuth, (req, res) => {
  res.render("userPages/userChangePassword");
});

// USER CHANGE PASSWORD POST ROUTE //
router.post(
  "/profile/user-change-password",
  userLoginAuth,
  validate(userChangePasswordValidator),
  userChangePassword,
);

// USER E-KYC GET ROUTE //
router.get("/profile/ekyc", userLoginAuth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { refreshToken: req.cookies.refreshToken },
  });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please login." });
  }

  if (user.eKyc === true) {
    // Decrypt and Mask userAadhaarNumber
    const decyptedAadhaarNumber = decryptData(user.aadhaarNumber);
    const maskedAadhaarNumber = "XXXX-XXXX-" + decyptedAadhaarNumber;

    // Decrypt and Mask userAadhaarPhoneNumber
    const decyptedAadhaarPhoneNumber = decryptData(user.aadhaarPhoneNumber);
    const maskedAadhaarPhoneNumber =
      decyptedAadhaarPhoneNumber.substr(0, 2) +
      "******" +
      decyptedAadhaarPhoneNumber.slice(-2);

    return res.status(200).json({
      success: true,
      message: "User e-kyc already completed",
      userData: { user, maskedAadhaarNumber, maskedAadhaarPhoneNumber },
    });
  } else {
    return res
      .status(200)
      .json({ success: true, message: "User e-kyc not completed" });
  }
});

// USER E-KYC POST ROUTE //
router.post(
  "/profile/ekyc",
  userLoginAuth,
  upload.single("aadhaarXmlFile"),
  (req, res, next) => {
    console.log("File received:", req.file); // Debug log
    next();
  },
  extractAadhaarXml,
);

// USER VERIFY-PHONE-NUMBER GET ROUTE //
router.get("/profile/ekyc/verify-phone-number", userLoginAuth, (req, res) => {
  res.render("userPages/userVerifyAadhaarPhoneNumber");
});

// USER VERIFY-PHONE-NUMBER POST ROUTE //
router.post(
  "/profile/ekyc/verify-phone-number",
  userLoginAuth,
  verifyUserMobileAndSendOtp,
);

// USER VERIFY-OTP GET ROUTE //
router.get(
  "/profile/ekyc/verify-phone-number/verify-otp",
  userLoginAuth,
  (req, res) => {
    res.render("userPages/userVerifyOtp");
  },
);

// USER VERIFY-OTP POST ROUTE //
router.post(
  "/profile/ekyc/verify-phone-number/verify-otp",
  userLoginAuth,
  userVerifyOtp,
);

// USER VERIFY PHONE NUMBER GET ROUTE //
router.get(
  "/profile/edit-profile/verify-phone-number",
  userLoginAuth,
  async (req, res) => {
    const user = await prisma.user.findFirst({
      where: { refreshToken: req.cookies.refreshToken },
    });

    const decryptedPhoneNumber = decryptData(user.phone);
    const maskedUserPhoneNumber =
      decryptedPhoneNumber.substr(0, 2) +
      "******" +
      decryptedPhoneNumber.slice(-2);
    res.render("userPages/userVerifyPhoneNumber", {
      user,
      maskedUserPhoneNumber,
    });
  },
);

// USER VERIFY PHONE NUMBER POST ROUTE //
router.post(
  "/profile/edit-profile/verify-phone-number",
  userLoginAuth,
  sendOtpToUserPhoneNumber,
);

// USER ENTER OTP TO VERIFY PHONE NUMBER GET ROUTE//
router.get(
  "/profile/edit-profile/enter-otp-to-verify-phone-number",
  userLoginAuth,
  (req, res) => {
    res.render("userPages/userVerifyPhoneNumberOtp");
  },
);

// USER ENTER OTP TO VERIFY PHONE NUMBER POST ROUTE//
router.post(
  "/profile/edit-profile/enter-otp-to-verify-phone-number",
  userLoginAuth,
  verifyUserPhoneNumberOtp,
);

// USER LOG OUT GET ROUTE //
router.get("/user-sign-out", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

export default router;
