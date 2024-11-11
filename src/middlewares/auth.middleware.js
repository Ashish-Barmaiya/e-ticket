// /// HOST LOGIN AUTH //
// const hostLoginAuth = (req, res, next) => {
//     // Checking if user is authenticated and is a host
//     if (req.isAuthenticated() && req.user && req.user.email) {
//         return next();
//     }
//     // If host is not authenticated
//     console.log("Host not authenticated");
//     res.redirect("/host/hostlogin?error=You need to log in as a host");
// };

// /// USER LOGIN AUTH ///
// const userLoginAuth = (req, res, next) => {
//     // Checking if user is authenticated and is a user
//     if (req.isAuthenticated() && req.user && req.user.email) {
//         return next();
//     }
//     // If user is not authenticated
//     console.log("User not authenticated");
//     res.redirect("/user/user-sign-in?error=You need to log in as a user");
// };

// export {
//     hostLoginAuth,
//     userLoginAuth,
// }


import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if(!token) {
        return res.status(403).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

const userLoginAuth = verifyToken;
const hostLoginAuth = verifyToken;

export { userLoginAuth, hostLoginAuth }