import express from "express";
import env from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { errorHandler } from "./src/middlewares/error.Middleware.js";

env.config();
const app = express();

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

// let __filename, __dirname;

// // Conditional setup for __filename and __dirname
// if (process.env.NODE_ENV === "test") {
//   // Fallback for Jest (mocked setup for tests)
//   __filename = path.resolve("./app.js");
//   __dirname = path.dirname(__filename);
// } else {
//   // Production setup
//   __filename = fileURLToPath(import.meta.url);
//   __dirname = path.dirname(__filename);
// }

const __filename = path.resolve("./app.js");
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

///// IMPORTING ROUTES /////
import homePageRouter from "./src/routes/homePage.Router.js"; // home page route
import hostRouter from "./src/routes/host.Router.js"; // host routes
import userRouter from "./src/routes/user.Router.js"; // user routes
import eventRouter from "./src/routes/event.Router.js"; // event routes

///// USING ROUTES /////
app.use("/", homePageRouter);
app.use("/host", hostRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);

// app.get("*", (req, res) => {
//     res.status(404).send("ERROR 404!! PAGE NOT FOUND");
// });

app.use(errorHandler);

export { app };
