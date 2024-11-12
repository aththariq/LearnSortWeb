const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Ensure the path to User model is correct
require("dotenv").config();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://your-heroku-app.herokuapp.com/auth/google/callback" // Update this with your actual Heroku app URL
          : "http://localhost:5000/auth/google/callback", // Local server URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Search for an existing user with the Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // If user doesn't exist, create a new user
          user = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
          });
        }

        done(null, user); // Complete authentication and pass the user object
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user for session management
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user to retrieve full user information from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
