import express from "express";
import { hostLoginAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

///// HANDLING HOSTDASHBOARD GET REQ AFTER CHECKING AUTH /////
router.get("/:hostId/dashboard", hostLoginAuth, (req, res) => {
    
    if (req.user.id === req.params.hostId) {

        res.status(200).render("hostDashboard", {
            host: req.user
        });
    } else {
        res.status(403).send("Access Denied");
    }
                
});

///// HANDLING LOGOUT  GET REQUEST /////
router.get("/:hostId/hostlogout", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect("/host/hostlogin");
    })
});

export default router;