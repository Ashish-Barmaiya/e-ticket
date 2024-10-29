import express from "express";
import { hostLoginAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:hostId/dashboard/edit-profile", hostLoginAuth, (req, res) => {
    
    if (req.user.id === req.params.hostId) {

        res.status(200).render("hostProfile", {
            host: req.user
        });
    } else {
        res.status(403).send("Access Denied");
    }
                
});

export default router;