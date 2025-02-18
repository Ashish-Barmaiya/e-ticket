import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { PrismaClient } from "@prisma/client";
import TicketController from "../controllers/tickets.Controller.js";
import {
  eventHomePage,
  eventDetailsPage,
} from "../controllers/events.Controller.js";

const router = express.Router();
const prisma = new PrismaClient();

/// EVENT-HOME PAGE GET ROUTE ///
router.get("/", eventHomePage);

/// EVENT DETAILS GET ROUTE ///
router.get("/:eventId/details", eventDetailsPage);

/// BUY-TICKET POST ROUTE ///
router.post(
  "/:eventId/details/buy-ticket",
  userLoginAuth,
  TicketController.buyTicket,
);

/// PRINT TICKET ROUTE ///
router.get(
  "/ticket/:ticketId",
  userLoginAuth,
  TicketController.printTicketDetails,
);

export default router;
