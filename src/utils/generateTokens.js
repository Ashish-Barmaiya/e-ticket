import env from "dotenv";
import jwt from "jsonwebtoken";

env.config();

const generateAccessToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN}
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN}
    );
};

export { 
    generateAccessToken,
    generateRefreshToken,
}