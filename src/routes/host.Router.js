import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { registerHost, loginHost, addVenue} from "../controllers/host.Controller.js";
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
    res.sendFile(path.join(__dirname, "../public/host/hostPage.html"));
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
router.get("/:hostId/dashboard", hostLoginAuth, (req, res) => {
    if (req.user.id === req.params.hostId) {
        res.status(200).render("hostDashboard", {
            host: req.user
        });
    } else {
        res.status(403).send("Access Denied");
    }
                
});

/// HOST LOGOUT  GET ROUTE ///
router.get("/:hostId/hostlogout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect("/host/hostlogin");
    })
});

/// HOST EDIT PROFILE GET ROUTE ///
router.get("/:hostId/dashboard/edit-profile", hostLoginAuth, (req, res) => {
    if (req.user.id === req.params.hostId) {
        res.status(200).render("hostProfile", {
            host: req.user
        });
    } else {
        res.status(403).send("Access Denied");
    }           
});

/// VENUE GET ROUTE ///
router.get("/:hostId/dashboard/venue", hostLoginAuth, async (req, res) => {
    const venue = await prisma.venueInformation.findFirst({
        where: { hostId : req.params.hostId}
    });

    if (req.user.id === req.params.hostId) {
        res.render("hostPages/venuePage", {
            host: req.user,
            venue: JSON.stringify(venue),
            venueName: venue.name,
            venueAddress: venue.address,
            venueType: venue.venueType,
            seatingCapacity: venue.seatingCapacity,
            seatingCategories: venue.seatingCategories,
        });
        console.log(JSON.stringify(venue));

    } else {
        res.status(403).send("Access Denied");
    }
});

/// ADD VENUE GET ROUTE ///
router.get("/:hostId/dashboard/venue/add-venue", hostLoginAuth, async (req, res) => {
    const venues = await prisma.venueInformation.findMany({
        where: { hostId : req.params.hostId}
    });

    if (req.user.id === req.params.hostId) {
        res.render("hostPages/addvenuePage", {
            host: req.user,
            venues
            
        });
    } else {
        res.status(403).send("Access Denied");
    }
});

/// ADD VENUE POST ROUTE ///
router.post("/:hostId/dashboard/venue/add-venue", hostLoginAuth, addVenue)

/// LIST NEW EVENT GET ROUTE ///
router.get("/:hostId/dashboard/list-new-events", hostLoginAuth, (req, res) => {
    if (req.user.id === req.params.hostId) {
        res.render("eventPages/newEventPage", {
            host: req.user
        });
    } else {
        res.status(403).send("Access Denied");
    }
});

/// LIST NEW EVENT POST ROUTE ///
router.post("/:hostId/dashboard/list-new-events", hostLoginAuth, newEventValidator, newEvent);

/// RESCHEDULE EVENT GET ROUTE ///
router.get("/:hostId/dashboard/reschedule-events", hostLoginAuth, (req, res) => {
    if (req.user.id === req.params.hostId) {
        res.status(200).send("This is Reschedule Event Page");
    } else {
        res.status(403).send("Access Denied")
    }
});

/// CANCEL EVENT GET ROUTE ///
router.get("/:hostId/dashboard/cancel-events", hostLoginAuth, (req, res) => {
    if (req.user.id === req.params.hostId) {
        res.status(200).send("This is Cancel Event Page");
    } else {
        res.status(403).send("Access Denied");
    }
});

export default router;