import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// RESELL TICKET HOME PAGE
router.get("/", (req, res) => {
  res.status(200).send("This is Ticket Reselling page");
});

export default router;
