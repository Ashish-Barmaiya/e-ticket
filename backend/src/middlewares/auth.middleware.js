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
    if (req.path.startsWith("/profile")) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      return res
        .status(401)
        .json({ message: "Authorization token is missing" });
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(401).json({ message: "Authorization token is missing" });
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
        return res
          .status(401)
          .json({ message: "Authorization token is missing" });
      }

      try {
        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );

        // Check both user and host tables for the refresh token
        let user = await prisma.user.findFirst({ where: { refreshToken } });
        let role = "user";
        if (!user) {
          user = await prisma.hosts.findFirst({ where: { refreshToken } });
          role = "host";
        }

        if (!user) {
          throw new Error("Invalid refresh token");
        }

        // Generate new tokens with the correct role
        const newAccessToken = generateAccessToken({ ...user, role });
        const newRefreshToken = generateRefreshToken({ ...user, role });

        // Update refresh token in the correct table
        if (role === "user") {
          await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
          });
        } else {
          await prisma.hosts.update({
            where: { id: user.id },
            data: { refreshToken: newRefreshToken },
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

        // Update req.user with new token data including role
        req.user = { ...user, role };
        return next();
      } catch (refreshError) {
        console.error("Refresh token error:", refreshError.message);
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(500).json({
          message: "Refresh token error",
          error: refreshError,
        });
      }
    }

    console.error("Token verification error:", error.message);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res
      .status(401)
      .json({ message: "Authentication failed", error: error });
  }
};

// Middleware to check if user is authenticated and has required role
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user?.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

const userLoginAuth = [verifyToken, checkRole(["user"])];
const hostLoginAuth = [verifyToken, checkRole(["host"])];

export { userLoginAuth, hostLoginAuth };
