import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, updateUserInfo } from "../controllers/user.Controllers.js";
import { userRegisterValidator,
         userLoginValidator,
         userUpdateValidator } from "../utils/validators.js";

const router = express.Router();

/// USER PAGE GET ROUTE ///
router.get("/", (req, res) => {
    res.render("userPages/userPage")
});

/// USER SIGN UP PAGE GET ROUTE ///
router.get("/user-sign-up", (req, res) => {
    res.render("userPages/userSignUp");
})

/// USER SIGN UP PAGE POST ROUTE ///
router.route("/user-sign-up").post(userRegisterValidator, registerUser)

/// USER SIGN IN PAGE GET ROUTE ///
router.get("/user-sign-in", (req, res) => {
    res.render("userPages/userSignIn", {
        user: req.user
    })
})

/// USER SIGN IN PAGE POST ROUTE ///
router.route("/user-sign-in").post(userLoginValidator, loginUser)

/// USER PROFILE PAGE GET ROUTE ///
router.get("/:userId/profile", userLoginAuth, (req, res) => {

    if (req.user.id === req.params.userId) {
        res.render("userPages/userProfile", {
            user: req.user
        });
    } else {
        res.status(403).send("Access Denied!!")
    }
});

/// USER EDIT PROFILE GET ROUTE ///
router.get("/:userId/profile/edit-profile", userLoginAuth, (req, res) => {
        res.render("userPages/userEditProfile", {
            user: req.user,
        })
    })


/// USER EDIT PROFILE POST ROUTE ///
router.post("/:userId/profile/edit-profile", userLoginAuth, userUpdateValidator, updateUserInfo)

/// USER LOG OUT GET ROUTE ///
router.get("/:userId/user-sign-out", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        res.redirect("/user")
    })
});

export default router;