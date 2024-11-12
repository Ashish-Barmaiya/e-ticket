import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { registerHost, loginHost, addVenue, newRefreshToken} from "../controllers/host.Controller.js";
import { hostRegisterValidator, hostLoginValidator } from "../utils/validators.js";
import { hostLoginAuth } from "../middlewares/auth.middleware.js";
import { newEventValidator } from "../utils/validators.js";
import { newEvent } from "../controllers/events.Controller.js";
import { PrismaClient } from "@prisma/client";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();
const prisma = new PrismaClient();
router.use(express.urlencoded({ extended: true }));

/// HOST PAGE GET ROUTE ///
router.get("/", (req, res) => {
    if (req.cookies.accessToken) {
        res.redirect("host/dashboard")
    } else {
        res.sendFile(path.join(__dirname, "../public/host/hostPage.html"));   
    }
})

/// HOST REGISTRATION PAGE GET ROUTE ///
router.get("/hostregister", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/host/hostRegister.html"), (err) => {
        if(err) {
            next(err);
        }
    });
});

/// HOST REGISTRATION PAGE POST ROUTE ///
router.post("/hostregister", hostRegisterValidator, registerHost);

/// HOST LOGIN PAGE GET ROUTE //
router.get("/hostlogin", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/host/hostLogin.html"));
});

/// HOST LOGIN PAGE POST ROUTE ///
router.route("/hostlogin").post(hostLoginValidator, loginHost);

/// HOST DASHBOARD GET ROUTE ///
router.get("/dashboard", hostLoginAuth, (req, res) => {
    res.status(200).render("hostDashboard", {
            host: req.user
    });
                
});

/// HOST EDIT PROFILE GET ROUTE ///
router.get("/dashboard/edit-profile", hostLoginAuth, (req, res) => {
    res.status(200).render("hostProfile", {
            host: req.user
        });           
});

/// VENUE GET ROUTE ///
router.get("/dashboard/venue", hostLoginAuth, async (req, res) => {
    const venue = await prisma.venueInformation.findFirst({
        where: { hostId : req.params.hostId}
    });
   res.render("hostPages/venuePage", {
            host: req.user,
            venue: JSON.stringify(venue),
    });
});

/// ADD VENUE GET ROUTE ///
router.get("/dashboard/venue/add-venue", hostLoginAuth, async (req, res) => {
    const venues = await prisma.venueInformation.findMany({
        where: { hostId : req.params.hostId}
    });
    res.render("hostPages/addvenuePage", {
            host: req.user,
            venues
            
    });
});

/// ADD VENUE POST ROUTE ///
router.post("/dashboard/venue/add-venue", hostLoginAuth, addVenue)

/// LIST NEW EVENT GET ROUTE ///
router.get("/dashboard/list-new-events", hostLoginAuth, (req, res) => {
    res.render("eventPages/newEventPage", {
            host: req.user
    });
});

/// LIST NEW EVENT POST ROUTE ///
router.post("/dashboard/list-new-events", hostLoginAuth, newEventValidator, newEvent);

/// RESCHEDULE EVENT GET ROUTE ///
router.get("/dashboard/reschedule-events", hostLoginAuth, (req, res) => {
    res.status(200).send("This is Reschedule Event Page");
});

/// CANCEL EVENT GET ROUTE ///
router.get("/dashboard/cancel-events", hostLoginAuth, (req, res) => {
    res.status(200).send("This is Cancel Event Page");
});

// HOST NEW-REFRESH-TOKEN POST ROUTE //
router.post("/refresh-token", newRefreshToken);

// HOST LOGOUT  GET ROUTE //
router.get("/hostlogout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/host/hostlogin");
});

export default router;