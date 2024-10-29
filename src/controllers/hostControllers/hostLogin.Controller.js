import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { PrismaClient } from "@prisma/client";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

// Configure the Passport Local Strategy for Host Authentication
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function verify (email, password, done) {
    try {

      console.log("Login attempt with email:", email);

      // Find the host by email in the database
      const host = await prisma.hosts.findUnique({
        where: { email: email },
      });
      console.log("Database result for host:", host);

      // If the host is not found, return an error
      if (!host) {
        console.log("No host found with email:", email);
        return done(null, false, { message: "Host not found" });
      }

      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, host.password);
      console.log("Password validation result:", isPasswordValid);

      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect Password" });
      }

      // Authentication successful, return the host object
      return done(null, host);
    } catch (error) {
      console.error("Error during host authentication:", error);
      return done(error);
    }
  })
);

// Passport Serialization and Deserialization for Session Handling
passport.serializeUser((user, done) => {
    console.log("Serializing User:", user);
  done(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
    console.log("Deserializing User with ID:", id);
    try {
        const host = await prisma.hosts.findUnique({
            where: { id: id }
        });
        if (host) {
            console.log("Deserialized User:", host);
            return cb(null, host);
        } else {
            console.log("User not found during deserialization");
            return cb(null, false);
        }
    } catch (error) {
        console.log("Error during deserialization:", error);
        return cb(error, false);
    }
});

// Login function handling the request and invoking the Local Strategy
const loginHost = (req, res, next) => {
  // Validate the request using express-validator
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json({ errors: validationErrors.array() });
  }

  // Use Passport's authenticate method with the local strategy
  passport.authenticate("local", (err, user, info) => {
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
};

export { loginHost };
