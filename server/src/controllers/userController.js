import userService from "../services/userService.js";
import followService from "../services/followService.js";
import argon2 from 'argon2';
import passport from "passport"
import mailer from "../config/nodemailer.js";
import { z } from "zod";

const searchInputSchema = z
    .string()
    .trim()
    .transform((val) => val.replace(/\s+/g, " "))
    .pipe(z.string().min(1).max(50));

const userController = {
    login:
        passport.authenticate('local', {
            successRedirect: 'login/success',
            failureRedirect: 'login/failure'
        })
    ,
    loginSuccess: async (req, res) => {

        if (req.isAuthenticated()) {
            return res.status(200).send(req.user.username);
        }
        return res.status(200);

    },
    loginFailure: async (req, res) => {

        res.status(401).send(false);

    },
    authUser: async (req, res) => {

        if (req.isAuthenticated()) {
            return res.status(200).json({ id: req.user.id, username: req.user.username, email: req.user.email, profile_picture: req.user.profile_picture });
        }
        return res.status(200);
    },
    googleAuth:
        passport.authenticate('google', {
            scope: ["email", "profile"]
        })
    ,
    googleAuthCallback:
        passport.authenticate('google', {
            successRedirect: "http://localhost:5173",
        })
    ,
    logout: async (req, res) => {

        req.logout((err) => {
            if (err) {
                console.log(err)
            }
            res.status(200).send(true);
        })

    },
    validateEmail: async (req, res) => {
        const { email, type } = req.body.data;

        const [user] = await userService.getUser(email);

        if (user) {
            if (type == "signup") {
                res.status(409).send(true);
            } else {
                res.status(200).send(true);
            }

        } else {
            if (type == "signup") {
                res.status(200).send(false);
            } else {
                res.status(404).send(false);
            }
        }

    },
    registerUser: async (req, res) => {
        const { username, email, password } = req.body.data;

        try {
            const hashedPassword = await argon2.hash(password);

            const [user] = await userService.registerUser(username, email, hashedPassword);

            req.login(user, (err) => {
                if (err) {
                    console.log(err)
                }
                res.redirect("login/success");
            })

        } catch (err) {
            console.log(err);
        }

    },
    forgotPassword: async (req, res) => {

        const email = req.body.email;

        const otp = Math.floor(100000 + (Math.random() * 900000))
        const expiryDate = Date.now() + 300000;

        try {

            const hashedOTP = await argon2.hash(otp.toString());

            req.session.otp = {
                code: hashedOTP,
                expiry: expiryDate
            }

        } catch (err) {
            console.log(err);
        }

        mailer(email, otp);

        res.status(200).send(true);

    },
    verifyOTP: async (req, res) => {

        const enteredOTP = req.body.OTP;
        const storedOTP = req.session.otp.code;
        const expiry = req.session.otp.expiry;


        if (await argon2.verify(storedOTP, enteredOTP)) {
            if (Date.now() < expiry) {
                res.status(202).send("valid");
            } else {
                res.status(200).send("expired");
            }
        } else {
            res.status(200).send("invalid");
        }


    },
    resetPassword: async (req, res) => {

        const email = req.body.email;
        const password = req.body.password;

        try {
            const hashedPassword = await argon2.hash(password);

            const success = await userService.resetPassword(email, hashedPassword);

            if (success) {
                res.status(200).send(true);
            } else {
                res.status(500).send(false);
            }

        } catch (err) {
            console.log(err);
        }

    },
    getUser: async (req, res) => {

        const id = req.body.id;

        let result = "";
        if (id) {
            [result] = await userService.getUserById(id);
        }

        res.status(200).send(result);

    },
    searchUsers: async (req, res) => {

        const validation = searchInputSchema.safeParse(req.body.query);
        // If client bypassed frontend validation or sent bad types, return 400 Bad Request
        if (!validation.success) {
            return res.status(400).json({
                error: "Invalid request parameters"
            });
        }

        // Escape Postgres ILIKE wildcards (% and _)
        const sanitizedQuery = validation.data.replace(/[%_]/g, "\\$&");

        const users = await userService.searchUsers(sanitizedQuery);
        res.status(200).send(users);

    },
    searchAllUsers: async (req, res) => {

        const offset = req.body.offset
        const currentUserID = req.body.userID

        const validation = searchInputSchema.safeParse(req.body.query);
        // If client bypassed frontend validation or sent bad types, return 400 Bad Request
        if (!validation.success) {
            return res.status(400).json({
                error: "Invalid request parameters"
            });
        }

        // Escape Postgres ILIKE wildcards (% and _)
        const sanitizedQuery = validation.data.replace(/[%_]/g, "\\$&");

        const users = await userService.searchAllUsers(sanitizedQuery, offset);

        let userIDs = "";
        let followIDs = "";
        let usersWithFollowIds = users;
        if (currentUserID) {
            userIDs = users.map(user => user.id);
            followIDs = await followService.getAllFollowData(userIDs, currentUserID);

            usersWithFollowIds = users.map(user => {
                // Find matching follow records for this specific user
                const [userFollow] = followIDs.filter(follow => follow.following_id === user.id);

                return {
                    ...user,
                    followID: userFollow?.id
                };
            });
        }

        res.status(200).send(usersWithFollowIds);

    }



}

export default userController;

