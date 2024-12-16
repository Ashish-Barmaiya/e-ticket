import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { 
    registerUser,
    loginUser,
    updateUserInfo,
    myTickets,
    userChangePassword 
} from "../controllers/user.Controllers.js";
import {
    validate,
    userRegisterValidator,
    userLoginValidator,
    userUpdateValidator,
    userChangePasswordValidator 
} from "../utils/validators.js";
import TicketController from "../controllers/tickets.Controller.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// USER PAGE GET ROUTE //
router.get("/", (req, res) => {
    if (req.cookies.accessToken) {
        res.redirect("/user/profile")
    } else {
        res.render("userPages/userPage")
    }
});

// USER SIGN UP PAGE GET ROUTE //
router.get("/user-sign-up", (req, res) => {
    res.render("userPages/userSignUp");
})

// USER SIGN UP PAGE POST ROUTE //
router.route("/user-sign-up").post(validate(userRegisterValidator), registerUser)

// USER SIGN IN PAGE GET ROUTE //
router.get("/user-sign-in", async (req, res) => {
    const user = await prisma.user.findFirst({
        where: { refreshToken: req.cookies.refreshToken }
    }) 
    res.render("userPages/userSignIn", {
        user
    })
})

// USER SIGN IN PAGE POST ROUTE //
router.route("/user-sign-in").post(validate(userLoginValidator), loginUser)

// USER PROFILE PAGE GET ROUTE //
router.get("/profile", userLoginAuth, async (req, res) => {
    const user = await prisma.user.findFirst({
        where: { refreshToken: req.cookies.refreshToken }
    }) 
    res.render("userPages/userProfile", {
        user
    });
});

// USER EDIT PROFILE GET ROUTE //
router.get("/profile/edit-profile", userLoginAuth, (req, res) => {
        res.render("userPages/userEditProfile", {
            user: req.user,
        })
    })

// USER EDIT PROFILE POST ROUTE //
router.post("/profile/edit-profile", userLoginAuth, validate(userUpdateValidator), updateUserInfo)

// USER MY-TICKETS GET ROUTE //
router.get("/profile/my-tickets", userLoginAuth, myTickets);

// USER CANCEL TICKET GET ROUTE //
router.get("/profile/my-tickets/cancel-ticket/:ticketId", userLoginAuth, async (req, res) => {
    const ticket =  await prisma.ticket.findUnique({
        where: { id: req.params.ticketId }
    })
    res.render("userPages/userCancelTicket", {
        ticket
    });
})

// USER CANCEL TICKET POST ROUTE //
router.post("/profile/my-tickets/cancel-ticket/:ticketId", userLoginAuth, TicketController.cancelTicket)


// USER CHANGE PASSWORD GET ROUTE //
router.get("/profile/user-change-password", userLoginAuth, (req, res) => {
    res.render("userPages/userChangePassword")
});

// USER CHANGE PASSWORD POST ROUTE //
router.post("/profile/user-change-password", userLoginAuth, validate(userChangePasswordValidator), userChangePassword)

// USER LOG OUT GET ROUTE //
router.get("/user-sign-out", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/user/user-sign-in");
});

export default router;