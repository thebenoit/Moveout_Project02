import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../../../mongo/schemas/user.js";

const router = express.Router();

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/client/google-auth/callback",
    
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({googleId: profile.id})
            if(!user){
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    date: Date.now(),
                    googlePicture: profile.photos[0].value,
                    isGoogleUser: true,
                    isVerified: true,
                })
            }
            return done(null,user)

        }catch(err){
            return done(err,null)
        }
    }
        
))


// Route pour l'authentification Google
router.get("auth/google/callback", passport.authenticate("google", {session: false}),
 async (req, res) => {
    try {
        const user = req.user;
        sessionId = crypto.randomUUID();
        const accessToken = await JWT.generateJwt(String(user._id), sessionId);
        const refreshToken = await JWT.generateRefreshToken(String(user._id), sessionId);

        const cookieOpts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        }

        res.cookie("access_token", accessToken, cookieOpts);
        res.cookie("session_id", sessionId, cookieOpts);


        res.json({
            user: req.user, 
            msg: "Authentication successful", 
            accessToken: accessToken, 
            refreshToken: refreshToken, 
            sessionId: sessionId, 
            expiresIn: 24 * 60 * 60})

    } catch (error) {
        console.error("Erreur lors de l'authentification Google: ", error);
        res.status(500).json({error: "Erreur lors de l'authentification Google"})
    }
    
 }
 
);



export default router;
