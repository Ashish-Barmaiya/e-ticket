import express from "express";
import env from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import redis from "redis";
import session from "express-session";
// import { errorHandler } from "./src/middlewares/error.Middleware.js";

env.config();
const app = express();

// REDIS SETUP //
const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6379,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error: ", err);
});

redisClient.connect();

// COOKIE-PARSER SETUP //
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// EXPRESS-SESSION SETUP //
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 },
  }),
);

const __filename = path.resolve("./app.js");
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

///// IMPORTING ROUTES /////
import homePageRouter from "./src/routes/homePage.Router.js"; // home page route
import hostRouter from "./src/routes/host.Router.js"; // host routes
import userRouter from "./src/routes/user.Router.js"; // user routes
import eventRouter from "./src/routes/event.Router.js"; // event routes
import resellRouter from "./src/routes/resell.Router.js"; // resell routes

///// USING ROUTES /////
app.use("/", homePageRouter);
app.use("/host", hostRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);
app.use("/resell-tickets", resellRouter);

// app.get("*", (req, res) => {
//     res.status(404).send("ERROR 404!! PAGE NOT FOUND");
// });

// app.use(errorHandler);

export { app, redisClient };
