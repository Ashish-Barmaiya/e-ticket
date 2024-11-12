import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if(!accessToken) {
        return res.status(403).json({ message: "Token is required" });
    }

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        // If access token is expired and refresh token exists
        if (error.name === "TokenExpiredError" && refreshToken) {
            // Redirect to refresh token endpoint
            return res.redirect(307, "/user/refresh-token");
        }
        
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const userLoginAuth = verifyToken;
const hostLoginAuth = verifyToken;

export { userLoginAuth, hostLoginAuth }