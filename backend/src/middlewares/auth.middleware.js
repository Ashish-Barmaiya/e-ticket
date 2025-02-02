import jwt from "jsonwebtoken";
import env from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

env.config();
const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken) {
    // For API endpoints, return JSON response
    if (req.path.startsWith("/profile")) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.redirect("/user/user-sign-in");
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Attach the user to the request
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      if (!refreshToken) {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.redirect("/user/user-sign-in");
      }

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );

        // Find the user or host based on the refresh token
        const user =
          (await prisma.user.findFirst({ where: { refreshToken } })) ||
          (await prisma.hosts.findFirst({ where: { refreshToken } }));

        if (!user) {
          throw new Error("Invalid refresh token");
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // Update refresh token in the database
        const updateData = { refreshToken: newRefreshToken };
        if (user.email) {
          await prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });
        } else {
          await prisma.hosts.update({
            where: { id: user.id },
            data: updateData,
          });
        }

        // Set new cookies
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        req.user = jwt.verify(newAccessToken, process.env.JWT_ACCESS_SECRET); // Attach new token payload
        return next();
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError.message);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.redirect("/user/user-sign-in");
      }
    }

    console.error("Token verification error:", error.message);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Middleware to check if user is authenticated and has required role
// const checkRole = (roles) => {
//     return (req, res, next) => {
//         if (!req.user) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         next();
//     };
// };

const userLoginAuth = [
  verifyToken,
  // checkRole(['user'])
];
const hostLoginAuth = [
  verifyToken,
  // checkRole(['host'])
];

export { userLoginAuth, hostLoginAuth };
