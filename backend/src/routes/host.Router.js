import express from "express";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import path from "path";
import {
  registerHost,
  loginHost,
  getHostData,
  addVenue,
  hostChangePassword,
} from "../controllers/host.Controller.js";
import {
  validate,
  hostRegisterValidator,
  hostLoginValidator,
  hostChangePasswordValidator,
  newEventValidator,
} from "../utils/validators.js";
import { hostLoginAuth } from "../middlewares/auth.middleware.js";
import { newEvent } from "../controllers/events.Controller.js";
import { PrismaClient } from "@prisma/client";
import { uploadImg } from "../middlewares/multer.Middleware.js";

// const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const prisma = new PrismaClient();
router.use(express.urlencoded({ extended: true }));

// HOST PAGE GET ROUTE //
router.get("/", (req, res) => {
  if (req.cookies.accessToken) {
    res.redirect("host/dashboard");
  } else {
    res.status(200).render("hostPages/hostPage");
  }
});

// HOST REGISTRATION PAGE GET ROUTE //
router.get("/hostregister", (req, res) => {
  res.status(200).render("hostPages/hostRegister");
});

// HOST REGISTRATION PAGE POST ROUTE //
router.post("/hostregister", validate(hostRegisterValidator), registerHost);

// HOST LOGIN PAGE GET ROUTE //
router.get("/hostlogin", (req, res) => {
  res.status(200).render("hostPages/hostLogin");
});

// HOST LOGIN PAGE POST ROUTE //
router.post("/hostlogin", validate(hostLoginValidator), loginHost);

// HOST DASHBOARD GET ROUTE //
router.get("/dashboard/:path?", hostLoginAuth, getHostData);

// HOST EDIT PROFILE GET ROUTE //
router.get("/dashboard/edit-profile", hostLoginAuth, (req, res) => {
  res.status(200).render("hostProfile", {
    host: req.user,
  });
});

// VENUE GET ROUTE //
// router.get("/dashboard/venue", hostLoginAuth, getVenues);

// ADD VENUE POST ROUTE //
router.post("/dashboard/venue/add-venue", hostLoginAuth, addVenue);

// LIST NEW EVENT POST ROUTE //
router.post(
  "/dashboard/list-new-event",
  hostLoginAuth,
  uploadImg.fields([
    { name: "posterImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  newEvent,
);

// HOST CHANGE-PASSWORD POST ROUTE //
router.post(
  "/dashboard/host-change-password",
  hostLoginAuth,
  validate(hostChangePasswordValidator),
  hostChangePassword,
);

// HOST LOGOUT  GET ROUTE //
router.get("/hostlogout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({
    success: true,
    message: "Host logged out successfully",
  });
});

export default router;
