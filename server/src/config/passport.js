import passport from "passport"
import LocalStrategy from "passport-local";
import GoogleStrategy from "passport-google-oauth2"
import argon2 from 'argon2';
import userService from "../services/userService.js";

const passportConfig = () => {

    passport.use("local", new LocalStrategy(async function verify(email, password, cb) {

        try {
            const [user] = await userService.getUser(email);

            if (user) {

                if (await argon2.verify(user.password, password)) {
                    cb(null, user);
                } else {
                    cb(null, false);
                }

            } else {
                cb(null, false);
            }

        } catch (err) {
            cb(err);
        }

    }));

    passport.use("google", new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/users/googleAuth/callback",
    }, async (accessToken, refreshToken, profile, cb) => {

        try {
            const [user] = await userService.getUser(profile.email);
            if (!user) {
                const username = profile.given_name.replace(/\s/g, "");
                const [newUser] = await userService.registerGoogleUser(username, profile.email);
                cb(null, newUser);
            } else {
                cb(null, user);
            }
        } catch (err) {
            cb(err);
        }

    }))

    passport.serializeUser((user, cb) => {
        cb(null, user);
    });

    passport.deserializeUser((user, cb) => {
        cb(null, user);
    });

}

export default passportConfig