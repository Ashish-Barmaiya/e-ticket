import express from "express";
import { userLoginAuth } from "../middlewares/auth.middleware.js";
import { 
    registerUser,
    loginUser,
    updateUserInfo,
    myTickets,
    // newRefreshToken,
    userChangePassword 
} from "../controllers/user.Controllers.js";
import {
    validate,
    userRegisterValidator,
    userLoginValidator,
    userUpdateValidator,
    userChangePasswordValidator 
} from "../utils/validators.js";

const router = express.Router();

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
router.route("/user-sign-up").post(userRegisterValidator, registerUser)

// USER SIGN IN PAGE GET ROUTE //
router.get("/user-sign-in", (req, res) => {
    res.render("userPages/userSignIn", {
        user: req.user
    })
})

// USER SIGN IN PAGE POST ROUTE //
router.route("/user-sign-in").post(validate(userLoginValidator), loginUser)

// USER PROFILE PAGE GET ROUTE //
router.get("/profile", userLoginAuth, (req, res) => {
        res.render("userPages/userProfile", {
            user: req.user
        });
});

// USER EDIT PROFILE GET ROUTE //
router.get("/profile/edit-profile", userLoginAuth, (req, res) => {
        res.render("userPages/userEditProfile", {
            user: req.user,
        })
    })

// USER EDIT PROFILE POST ROUTE //
router.post("/profile/edit-profile", userLoginAuth, userUpdateValidator, updateUserInfo)

// USER MY-TICKETS GET ROUTE //
router.get("/profile/my-tickets", userLoginAuth, myTickets);

// USER CHANGE PASSWORD GET ROUTE //
router.get("/profile/user-change-password", userLoginAuth, (req, res) => {
    res.render("userPages/userChangePassword")
});

// USER CHANGE PASSWORD POST ROUTE //
router.post("/profile/user-change-password", userLoginAuth, userChangePasswordValidator, userChangePassword)

// USER NEW-REFRESH-TOKEN POST ROUTE //
// router.post("/refresh-token", newRefreshToken)

// USER LOG OUT GET ROUTE //
router.get("/user-sign-out", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.redirect("/user/user-sign-in");
});

export default router;