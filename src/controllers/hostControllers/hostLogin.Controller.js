import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

// PASSPORT LOCAL STRATEGY //
passport.use(
  "local-host",
  new LocalStrategy({ usernameField: "email" }, async function verify (email, password, done) {
    try {

      // Finding the host by email in the database
      const host = await prisma.hosts.findUnique({
        where: { email },
      });
      // If the host is not found, returning an error
      if (!host) {
        return done(null, false, { message: "Host not found" });
      }
      // Validating the password
      const isPasswordValid = await bcrypt.compare(password, host.password);

      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect Password" });
      }
      // Authentication successful, returning the host object
      return done(null, host);

    } catch (error) {
      console.error("Error during host authentication:", error);
      return done(error);
    }
  })
);

// PASSPORT SERIALIZEUSER //
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// PASSPORT DESERIALIZEUSER //
passport.deserializeUser(async (id, done) => {
  try {
       // For Host table
      const host = await prisma.hosts.findUnique({ where: { id } });
      if (host) {
          return done(null, host);
      }
      // For User table
      const user = await prisma.user.findUnique({ where: { id } });
      if (user) {
          return done(null, user);
      }
      // If no match is found in either tables
      return done(null, false);

  } catch (error) {
      return done(error, false);
  }
});


// LOGIN FUNCTION INVOKING THE LOCAL STRATEGY //
const loginHost = (req, res, next) => {

  // Validating the request using express-validator
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }
  // Using Passport authenticate method with the local strategy
  passport.authenticate("local-host", (err, user, info) => {
    console.log("Inside passport.authenticate callback");

    if (err) {
      console.error("Error in passport authentication:", err);
      return next(err);
    }
    
    if (!user) {
      console.log("Authentication failed:", info.message);
      return res.redirect("/host/hostlogin?error=" + info.message);
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        console.error("Error in req.login:", loginErr);
        return next(loginErr);
      }

      console.log("Successfully logged in host:", user);
      res.redirect(`/host/${user.id}/dashboard`);
    });
  })(req, res, next);
}

export { loginHost }
