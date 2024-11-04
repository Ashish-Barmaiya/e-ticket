import express from "express";
import env from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

env.config();

const app = express(); // Ensure this is defined before using it (I defined it after importing routes which was triggering errors)

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
/* Home Route */
import homePage_Router from "./src/routes/homePage.Router.js"

/* Host Routes */
import host_Router from "./src/routes/hostRoutes/host.Router.js";

import hostRegister_Router from "./src/routes/hostRoutes/hostRegister.Router.js";
import hostLogin_Router from "./src/routes/hostRoutes/hostLogin.Router.js";

import hostDashboard_Router from "./src/routes/hostRoutes/hostDashboard.Router.js";
import hostProfile_Router from "./src/routes/hostRoutes/hostProfile.Router.js";

import listNewEvent_Router from "./src/routes/hostRoutes/listNewEvent.Router.js";
import rescheduleEvent_Router from "./src/routes/hostRoutes/rescheduleEvent.Router.js";
import cancelEvent_Router from "./src/routes/hostRoutes/cancelEvent.Router.js";

/* User Route */
import userRouter from "./src/routes/user.Router.js";

///// SETTING UP EXPRESS-SESSION /////
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: { 
       secure: false,
       httpOnly: true,
       maxAge: 1000 * 60 * 10, // 10 minutes
   },
}));

app.use(passport.initialize());
app.use(passport.session());

///// USING ROUTES /////
app.use("/", homePage_Router);
app.use("/host", host_Router);

app.use("/host/hostregister", hostRegister_Router);
app.use("/host/hostlogin", hostLogin_Router);

app.use("/host", hostDashboard_Router);
app.use("/host", hostProfile_Router);
app.use("/host", listNewEvent_Router);
app.use("/host", rescheduleEvent_Router);
app.use("/host", cancelEvent_Router);

app.use("/user", userRouter);

export { app };