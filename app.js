import express from "express";
import env from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

env.config();
const app = express();

app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(express.static("public"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

///// IMPORTING ROUTES /////
import homePageRouter from "./src/routes/homePage.Router.js"; // home page route
import hostRouter from "./src/routes/host.Router.js"; // host routes
import userRouter from "./src/routes/user.Router.js"; // user routes
import eventRouter from "./src/routes/event.Router.js"; // event routes

///// SETTING UP EXPRESS-SESSION /////
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: { 
       secure: false,
       httpOnly: true,
       maxAge: 1000 * 60 * 60, // 60 minutes
   },
}));

app.use(passport.initialize());
app.use(passport.session());

///// USING ROUTES /////
app.use("/", homePageRouter);
app.use("/host", hostRouter);
app.use("/user", userRouter);
app.use("/events", eventRouter);


// app.get("*", (req, res) => {
//     res.status(404).send("ERROR 404!! PAGE NOT FOUND");
// });

export { app };