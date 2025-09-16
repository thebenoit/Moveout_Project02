import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../../mongo/schemas/user.js";
import JWT from "../../../mongo/interface/JWT.js";
import crypto from "crypto";
import { createClient } from "redis";

const router = express.Router();

const BASE_URL = process.env.API_BASE_URL || "http://localhost:4000";
const CALLBACK_URL = `${BASE_URL}/api/client/auth/google/callback`;
console.log("CALLBACK_URL: ", CALLBACK_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (err) => console.error("Redis client Error", err));
redisClient.connect().catch(console.error);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.CLIENT_GOOGLE_SECRET_KEY,
      callbackURL: CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            date: Date.now(),
            googlePicture: profile.photos[0].value,
            isGoogleUser: true,
            isVerified: true,
            hasAccess: false,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (req, res) => {
    res.json({ msg: "Authentication successful" });
  }
);

// Route pour l'authentification Google
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    console.log("Essaie de s'identifier!")
    try {
      const user = req.user;
      const sessionId = crypto.randomUUID();
      const accessToken = await JWT.generateJwt(String(user._id), sessionId);
      const refreshToken = await JWT.generateRefreshToken(
        String(user._id),
        sessionId
      );

      const cookieOpts = {
        httpOnly: true,
        secure: true,//process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
        domain: ".moveout.ai"
      };

      res.cookie("access_token", accessToken, cookieOpts);
      res.cookie("session_id", sessionId, cookieOpts);

      // axios
      //   .post(`${process.env.VITE_LLM_AGENT_ENDPOINT}/fb-session/enqueue/${user._id}`)
      //   .catch(console.error);

      // redisClient
      //   .publish("user_logged_in",String(user._id))
      //   .then(() => console.log(`Publié user_logged_in pour ${user._id}`))
      //   .catch(console.error);

      const FRONTEND_URL = "https://www.moveout.ai";
      console.log("authentification complete!")
      return res.redirect(FRONTEND_URL);
    } catch (error) {
      console.error("Erreur lors de l'authentification Google: ", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'authentification Google" });
    }
  }
);

export default router;
