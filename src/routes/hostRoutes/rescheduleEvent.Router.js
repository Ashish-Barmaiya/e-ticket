import express from "express";
import { hostLoginAuth } from "../../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/:hostId/dashboard/reschedule-events", hostLoginAuth, (req, res) => {

    if (req.user.id === req.params.hostId) {
        res.status(200).send("This is Reschedule Event Page");
    } else {
        res.status(403).send("Access Denied")
    }
})

export default router;